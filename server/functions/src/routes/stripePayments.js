import mysql from 'promise-mysql';
import SSM from 'aws-sdk/clients/ssm.js';

import config from '../config.js';
import Stripe from 'stripe';
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

const validateSubscriptionData = async (subData, price) => {
  if (subData.reg_type !== 'individual' && subData.reg_type !== 'team') {
    throw new Error('Reg_type must be "individual" or "team"');
  }

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

const getPrice = async subData => {
  const { sku_id, payment_plan_id } = subData.items[0];
  const prices = (await stripe.prices.list({ product: sku_id, active: true }))
    .data;
  console.log(prices);
  const price = prices.find(x => x.metadata.externalId === payment_plan_id);
  console.log(price);
  return price;
};

const createSubscription = async (customer, subData, price) => {
  const subscriptionScheduleData = {
    customer: customer.id,
    start_date: 'now',
    end_behavior: 'cancel',
    phases: [
      {
        plans: [
          {
            price: price.id,
            quantity: subData.items[0].quantity,
          },
        ],
        iterations: price.metadata.iterations,
      },
    ],
    metadata: {
      reg_type: subData.reg_type,
      reg_response_id: subData.reg_response_id,
      owner_id: price.metadata.owner_id,
      event_id: price.metadata.event_id,
      division_id: price.metadata.division_id,
    },
    expand: ['subscription.latest_invoice.payment_intent'],
  };

  const schedule = await stripe.subscriptionSchedules.create(
    subscriptionScheduleData
  );

  console.log(`Stripe Schedule ${schedule.id} created`);

  const invoice = await stripe.invoices.pay(
    schedule.subscription.latest_invoice.id
  );

  console.log(`Invoice ${invoice.id} attempted payment`);

  const subscription = await stripe.subscriptions.update(
    schedule.subscription.id,
    {
      metadata: { ...subscriptionScheduleData.metadata },
    }
  );

  console.log(`Stripe Subscription ${subscription.id} added metadata`);
  return subscription;
};

export const processCreateSubscription = async subData => {
  console.log(subData);
  const price = await getPrice(subData);
  await validateSubscriptionData(subData, price);
  const customer = await createOrUpdateCustomer(subData);
  const paymentMethod = await attachPaymentMethod(
    customer,
    subData.paymentMethodId
  );

  const subscription = await createSubscription(customer, subData, price);

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

    const reg_type = subscription.metadata.reg_type;
    const reg_response_id = subscription.metadata.reg_response_id;
    const owner_id = subscription.metadata.owner_id;
    console.log(
      `Registration type: ${reg_type}. Reg_response_id: ${reg_response_id}`
    );

    const tableName =
      reg_type === 'team'
        ? 'registrations_responses_teams'
        : 'registrations_responses_individuals';

    const toConn = await mysql.createConnection(toParams.db);

    const existingRecords = await toConn.query(
      `select * from ${toParams.db.database}.${tableName} where reg_response_id=?`,
      [reg_response_id]
    );

    const newPaymentAmount = +event.data.object.amount_paid / 100;
    const newPaymentDate = new Date(
      +event.data.object.status_transitions.paid_at * 1000
    );
    // If registration response already exists in the target database then add the payment amount
    if (existingRecords.length > 0) {
      await toConn.query(
        `update ${toParams.db.database}.${tableName} set payment_amount=payment_amount+?, 
           payment_date=?,ext_payment_id=? where reg_response_id=?`,
        [
          newPaymentAmount,
          newPaymentDate,
          event.data.object.id,
          reg_response_id,
        ]
      );
    } else {
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
      reg_response.payment_amount = newPaymentAmount;
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
    await toConn.end();
    console.log(
      `Successfully processed. Registration data copied to main database`
    );
  }
};
