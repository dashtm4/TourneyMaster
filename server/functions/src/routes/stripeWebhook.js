import mysql from 'promise-mysql';
import SSM from 'aws-sdk/clients/ssm.js';

import config from '../config.js';
import Stripe from 'stripe';
import { getPaymentPlans } from '../services/activeProducts.js';
const stripe = Stripe(config.STRIPE_API_SECRET_KEY);
const ssm = new SSM({ region: 'us-east-1' });

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

  let endpointSecret;
  if (req.body.account) {
    endpointSecret = process.env.STRIPE_CONNECT_WEBHOOK_SIGNING_SECRET;
  } else {
    endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
  }

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    console.log('Webhook Stripe signature verification: OK');
  } catch (err) {
    console.log('Webhook Stripe signature verification: FAILED');
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (
    event.type === 'invoice.payment_succeeded' ||
    event.type === 'invoice.payment_failed'
  ) {
    console.log('Payment success/failure processing...');
    const fromParams = await getParams(
      process.env.PUBLIC_API_SM_PARAMETER_NAME
    );
    const toParams = await getParams(process.env.PRIVATE_API_SM_PARAMETER_NAME);

    const requestParams = event.account
      ? { stripeAccount: event.account }
      : null;

    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription,
      requestParams
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

    const paidRatio =
      +event.data.object.amount_paid / +event.data.object.amount_due;

    for (const lineItem of event.data.object.lines.data) {
      if (+lineItem.price.unit_amount === 0) continue; // Skip line items with zero price

      const dbResponses = await toConn.query(
        `select * from ${toParams.db.database}.${tableName} where reg_response_id=?`,
        [reg_response_id]
      );

      let dbPayments = await toConn.query(
        `select * from ${toParams.db.database}.registrations_payments where reg_response_id=?`,
        [reg_response_id]
      );

      if (event.type === 'invoice.payment_succeeded') {
        const newPaymentAmount = Math.round(+lineItem.amount * paidRatio) / 100;
        const newPaymentTax =
          Math.round(
            +lineItem.tax_amounts.reduce((a, x) => a + +x.amount, 0) * paidRatio
          ) / 100;
        const newPaymentFees =
          Math.round(newPaymentAmount * 100 * 0.029) / 100 + 0.3;
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
          reg_response.currency = paymentPlan.currency;
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
          sql = `INSERT INTO ${
            toParams.db.database
          }.${tableName}\n   (${sql.slice(0, -1)}) \nVALUES (${values.slice(
            0,
            -1
          )})`;

          await toConn.query(sql, params);
        }

        // If there is no payment schedule in the database create one
        if (dbPayments.length === 0) {
          const sql = `INSERT INTO ${toParams.db.database}.registrations_payments 
      (reg_response_id, installment_id, payment_date, payment_status, currency, amount_due, is_active_YN, created_by)
      VALUES (?, ?, ?, 'scheduled', ?, ?, 1, ?)`;
          let params = [];
          if (paymentPlan.type === 'schedule') {
            params = paymentPlan.schedule.map(phase => [
              reg_response_id,
              phase.price_external_id,
              phase.date === 'now' ? new Date() : new Date(+phase.date * 1000),
              paymentPlan.currency,
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
                    now.setMonth(
                      now.getMonth() + i * +paymentPlan.intervalCount
                    )
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
                    now.setDate(
                      now.getDate() + 7 * i * +paymentPlan.intervalCount
                    )
                  )
                );
              }
            }
            params = installmentDates.map(date => [
              reg_response_id,
              paymentPlan.payment_plan_id,
              date,
              paymentPlan.currency,
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
          [
            newPaymentAmount,
            newPaymentDate,
            event.data.object.id,
            reg_response_id,
          ]
        );

        let availableForAllocation = await findScheduledPaymentToAllocateTo(
          paymentPlan,
          toConn,
          toParams,
          reg_response_id,
          lineItem.price.metadata.externalId
        );

        if (availableForAllocation) {
          console.log(
            `Allocating to: ${JSON.stringify(availableForAllocation)}`
          );
          await toConn.query(
            `update ${toParams.db.database}.registrations_payments set amount_paid=amount_paid+?, amount_fees=amount_fees+?, amount_tax=amount_tax+?, amount_net=amount_net+?,
           payment_date=?,ext_payment_system=?, ext_payment_id=?, payment_status=?, payment_details=? where reg_payment_id=?`,
            [
              newPaymentAmount,
              newPaymentFees,
              newPaymentTax,
              newPaymentAmount - newPaymentFees - newPaymentTax,
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
        console.log(
          `Successfully processed. Registration data copied to main database`
        );
      } else if (event.type === 'invoice.payment_failed') {
        let availableForAllocation = await findScheduledPaymentToAllocateTo(
          paymentPlan,
          toConn,
          toParams,
          reg_response_id,
          lineItem.price.metadata.externalId
        );

        if (availableForAllocation) {
          console.log(
            `Allocating failed payment to: ${JSON.stringify(
              availableForAllocation
            )}`
          );
          await toConn.query(
            `update ${toParams.db.database}.registrations_payments 
           set payment_date=?,ext_payment_system=?, ext_payment_id=?, payment_status=?, payment_details=? where reg_payment_id=?`,
            [
              new Date(
                +event.data.object.status_transitions.finalized_at * 1000
              ),
              'stripe',
              event.data.object.id,
              'failed',
              JSON.stringify(event),
              availableForAllocation.reg_payment_id,
            ]
          );
        } else {
          console.log('Unable to allocate a failed payment');
        }
      }
    }
    await toConn.end();
  } else {
    throw new Error(`Event '${event.type}' not supported by the webhook`);
  }
};

const findScheduledPaymentToAllocateTo = async (
  paymentPlan,
  toConn,
  toParams,
  reg_response_id,
  externalId
) => {
  let dbPayments;
  if (paymentPlan.type === 'installment') {
    dbPayments = await toConn.query(
      `select * from ${toParams.db.database}.registrations_payments where reg_response_id=?`,
      [reg_response_id]
    );
  } else if (paymentPlan.type === 'schedule') {
    dbPayments = await toConn.query(
      `select * from ${toParams.db.database}.registrations_payments where reg_response_id=? and installment_id=?`,
      [reg_response_id, externalId]
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
  return availableForAllocation;
};
