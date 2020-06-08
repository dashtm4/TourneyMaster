import mysql from 'promise-mysql';
import SSM from 'aws-sdk/clients/ssm.js';

import config from '../config.js';
import Stripe from 'stripe';
import { getPaymentPlans } from '../services/activeProducts.js';
const stripe = Stripe(config.STRIPE_API_SECRET_KEY);
const ssm = new SSM({ region: 'us-east-1' });
const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

const createOrUpdateCustomer = async subData => {
  const customerData = {
    ...subData.customer,
    metadata: {
      reg_type: subData.reg_type,
      reg_response_id: subData.reg_response_id,
    },
  };
  console.log(customerData);

  let customer;
  const customers = await stripe.customers.list({
    email: customerData.email,
    limit: 1,
  });
  if (customers.data.length === 0) {
    customer = await stripe.customers.create(customerData);
    console.log(`Stripe Customer ${customer.id} created`);
  } else {
    customer = await stripe.customers.update(
      customers.data[0].id,
      customerData
    );
    console.log(`Stripe Customer ${customer.id} updated`);
  }

  return customer;
};

const attachPaymentMethod = async (customer, paymentMethodId) => {
  const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customer.id,
  });

  console.log(
    `Stripe PaymentMethod ${paymentMethod.id} attached to customer ${customer.id}`
  );

  await stripe.customers.update(customer.id, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  console.log(
    `Stripe PaymentMethod ${paymentMethod.id} set as default customer`
  );
  return paymentMethod;
};

const validateSubscriptionData = async (subData /* price */) => {
  if (subData.reg_type !== 'individual' && subData.reg_type !== 'team') {
    throw new Error('Reg_type must be "individual" or "team"');
  }
};

const createSubscription = async (customer, paymentPlan, subData) => {
  const validatePrice = async price => {
    if (price.unit_amount > process.env.MAX_PAYMENT_AMOUNT * 100) {
      console.error(
        `Payment amount ${price.unit_amount /
          100} is higher than MAX_PAYMENT_AMOUNT=${
          process.env.MAX_PAYMENT_AMOUNT
        }`
      );
      throw new Error(
        `Payment amount ${price.unit_amount /
          100} cannot be processed online. Please contact the event organizer.`
      );
    }
  };

  const getPrice = async ({ sku_id, payment_plan_id }) => {
    const prices = (await stripe.prices.list({ product: sku_id, active: true }))
      .data;
    console.log(prices);
    const price = prices.find(x => x.metadata.externalId === payment_plan_id);
    console.log(price);
    await validatePrice(price);

    return price;
  };

  let phases = [];
  if (paymentPlan.type === 'installment') {
    const price = await getPrice(paymentPlan);

    phases.push({
      plans: [{ price: price.id, quantity: subData.items[0].quantity }],
      iterations: paymentPlan.iterations,
      proration_behavior: 'none',
    });
  } else if (paymentPlan.type === 'schedule') {
    phases = paymentPlan.schedule.sort(
      (a, b) => a.date > b.date || b.date === 'now'
    );

    phases = await Promise.all(
      phases.map(async (phase, i) => {
        const price = await getPrice({
          sku_id: paymentPlan.sku_id,
          payment_plan_id: phase.price_external_id,
        });

        const t = {
          plans: [
            {
              price: price.id,
              quantity: subData.items[0].quantity,
            },
          ],
          end_date: Math.round(
            (i < phases.length - 1
              ? new Date(phases[i + 1].date)
              : phase.date === 'now'
              ? new Date(new Date().setDate(new Date().getDate() + 1))
              : new Date(new Date().setDate(new Date(phase.date).getDate() + 1))
            ).getTime() /
              1000 +
              60 * 60 * 5
          ),
          proration_behavior: 'none',
        };
        return t;
      })
    );
    console.log();
  }

  const subscriptionScheduleData = {
    customer: customer.id,
    start_date: 'now',
    end_behavior: 'cancel',
    phases,
    metadata: {
      reg_type: subData.reg_type,
      reg_response_id: subData.reg_response_id,
      owner_id: paymentPlan.owner_id,
      event_id: paymentPlan.event_id,
      division_id: paymentPlan.division_id,
      sku_id: paymentPlan.sku_id,
      payment_plan_id: paymentPlan.payment_plan_id,
    },
    expand: ['subscription.latest_invoice.payment_intent'],
  };

  const schedule = await stripe.subscriptionSchedules.create(
    subscriptionScheduleData
  );

  console.log(`Stripe Schedule ${schedule.id} created`);

  let subscription = await stripe.subscriptions.update(
    schedule.subscription.id,
    {
      metadata: { ...subscriptionScheduleData.metadata },
    }
  );

  console.log(`Stripe Subscription ${subscription.id} added metadata`);

  const invoice = await stripe.invoices.pay(
    schedule.subscription.latest_invoice.id
  );

  console.log(`Invoice ${invoice.id} attempted payment`);

  subscription = await stripe.subscriptions.retrieve(subscription.id, {
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription;
};

export const processCreateSubscription = async subData => {
  console.log(subData);

  const paymentPlan = (await getPaymentPlans(subData.items[0]))[0];
  // const price = await getPrice(subData);
  await validateSubscriptionData(subData /*, price */);
  const customer = await createOrUpdateCustomer(subData);
  const paymentMethod = await attachPaymentMethod(
    customer,
    subData.paymentMethodId
  );

  const subscription = await createSubscription(
    customer,
    paymentPlan,
    subData /*, price */
  );

  return subscription;
};

export const paymentSuccessWebhook = async req => {
  const getParams = async paramName => {
    return JSON.parse(
      (
        await ssm
          .getParameter({
            Name: paramName,
            WithDecryption: true,
          })
          .promise()
      ).Parameter.Value
    );
  };

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    console.log('Webhook Stripe signature verification: OK');
  } catch (err) {
    console.log('Webhook Stripe signature verification: FAILED');
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'invoice.payment_succeeded') {
    console.log('Payment success processing...');
    const fromParams = await getParams(
      process.env.PUBLIC_API_SM_PARAMETER_NAME
    );
    const toParams = await getParams(process.env.PRIVATE_API_SM_PARAMETER_NAME);

    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription
    );

    const {
      reg_type,
      reg_response_id,
      owner_id,
      sku_id,
      payment_plan_id,
    } = subscription.metadata;
    console.log(
      `Registration type: ${reg_type}. Reg_response_id: ${reg_response_id}. Payment_plan_id: ${payment_plan_id}`
    );

    console.log(`sku_id: ${sku_id}, payment_plan_id: ${payment_plan_id}`);
    const paymentPlan = (await getPaymentPlans({ sku_id, payment_plan_id }))[0];
    console.log('paymentPlan', paymentPlan);

    const tableName =
      reg_type === 'team'
        ? 'registrations_responses_teams'
        : 'registrations_responses_individuals';

    const toConn = await mysql.createConnection(toParams.db);

    const dbResponses = await toConn.query(
      `select * from ${toParams.db.database}.${tableName} where reg_response_id=?`,
      [reg_response_id]
    );
    let dbPayments = await toConn.query(
      `select * from ${toParams.db.database}.registrations_payments where reg_response_id=?`,
      [reg_response_id]
    );

    const newPaymentAmount = +event.data.object.amount_paid / 100;
    const newPaymentDate = new Date(
      +event.data.object.status_transitions.paid_at * 1000
    );

    // If registration response does not exist in the target database then create one
    if (dbResponses.length === 0) {
      const fromConn = await mysql.createConnection(fromParams.db);
      const reg_response = (
        await fromConn.query(
          `select * from ${fromParams.db.database}.${tableName} where reg_response_id=?`,
          [reg_response_id]
        )
      )[0];
      await fromConn.end();

      // Add Stripe stuff here
      reg_response.ext_payment_system = 'stripe';
      reg_response.ext_payment_id = event.data.object.id;
      reg_response.amount_due = paymentPlan.total_price;
      reg_response.payment_amount = 0;
      reg_response.payment_date = newPaymentDate;
      reg_response.created_by = owner_id;

      let sql = '';
      let values = '';
      let params = [];
      for (let fieldName in reg_response) {
        sql += fieldName + ',';
        values += '?,';
        params.push(reg_response[fieldName]);
      }
      sql = `INSERT INTO ${toParams.db.database}.${tableName}\n   (${sql.slice(
        0,
        -1
      )}) \nVALUES (${values.slice(0, -1)})`;

      await toConn.query(sql, params);
    }

    // If there is no payment schedule in the database create one
    if (dbPayments.length === 0) {
      const sql = `INSERT INTO ${toParams.db.database}.registrations_payments 
      (reg_response_id, installment_id, payment_date, payment_status, amount_due, is_active_YN, created_by)
      VALUES (?, ?, ?, 'scheduled', ?, 1, ?)`;
      let params = [];
      if (paymentPlan.type === 'schedule') {
        params = paymentPlan.schedule.map(phase => [
          reg_response_id,
          phase.price_external_id,
          phase.date,
          phase.amount,
          owner_id,
        ]);
      } else if (paymentPlan.type === 'installment') {
        let installmentDates = [];
        for (let i = 0; i < paymentPlan.iterations; i++) {
          const now = new Date();
          if (paymentPlan.interval === 'month') {
            installmentDates.push(
              new Date(
                now.setMonth(now.getMonth() + i * +paymentPlan.intervalCount)
              )
            );
          } else if (paymentPlan.interval === 'day') {
            installmentDates.push(
              new Date(
                now.setDate(now.getDate() + i * +paymentPlan.intervalCount)
              )
            );
          } else if (paymentPlan.interval === 'week') {
            installmentDates.push(
              new Date(
                now.setDate(now.getDate() + 7 * i * +paymentPlan.intervalCount)
              )
            );
          }
        }
        params = installmentDates.map(date => [
          reg_response_id,
          paymentPlan.payment_plan_id,
          date,
          paymentPlan.price,
          owner_id,
        ]);
      }

      console.log(`Sql: ${sql}. Params: ${params}`);
      for (let param of params) {
        const res = await toConn.query(sql, param);
        console.log(res);
      }
    }

    await toConn.query(
      `update ${toParams.db.database}.${tableName} set payment_amount=payment_amount+?, 
           payment_date=?,ext_payment_id=? where reg_response_id=?`,
      [newPaymentAmount, newPaymentDate, event.data.object.id, reg_response_id]
    );

    if (paymentPlan.type === 'installment') {
      dbPayments = await toConn.query(
        `select * from ${toParams.db.database}.registrations_payments where reg_response_id=?`,
        [reg_response_id]
      );
    } else if (paymentPlan.type === 'schedule') {
      dbPayments = await toConn.query(
        `select * from ${toParams.db.database}.registrations_payments where reg_response_id=? and installment_id=?`,
        [
          reg_response_id,
          event.data.object.lines.data[0].price.metadata.externalId,
        ]
      );
    }

    console.log(
      `Scheduled payments: ${JSON.stringify(
        dbPayments
      )}. Attempting to allocate the payment to a scheduled one`
    );

    const availableForAllocation = dbPayments.reduce((a, c) => {
      if (+c.amount_due - +c.amount_paid > 0) {
        if (!a || new Date(a.payment_date) > new Date(c.payment_date)) {
          return c;
        } else {
          return a;
        }
      } else {
        return a;
      }
    }, null);

    if (availableForAllocation) {
      console.log(`Allocating to: ${JSON.stringify(availableForAllocation)}`);
      await toConn.query(
        `update ${toParams.db.database}.registrations_payments set amount_paid=amount_paid+?, amount_fees=amount_fees+?, amount_net=amount_net+?,
           payment_date=?,ext_payment_system=?, ext_payment_id=?, payment_status=?, payment_details=? where reg_payment_id=?`,
        [
          newPaymentAmount,
          0,
          newPaymentAmount,
          newPaymentDate,
          'stripe',
          event.data.object.id,
          'paid',
          JSON.stringify(event),
          availableForAllocation.reg_payment_id,
        ]
      );
    } else {
      console.log('Unable to allocate the payment');
    }

    await toConn.end();
    console.log(
      `Successfully processed. Registration data copied to main database`
    );
  }
};
