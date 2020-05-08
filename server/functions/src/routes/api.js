import config from '../config.js';
import Stripe from 'stripe';
import SSM from 'aws-sdk/clients/ssm.js';
import mysql from 'promise-mysql';

const ssm = new SSM({ region: 'us-east-1' });
const stripe = Stripe(config.STRIPE_API_SECRET_KEY);
const endpointSecret =
  process.env.STRIPE_WEBHOOK_SIGNING_SECRET ||
  'whsec_pqHQrhQL4qZPhzniRAaB4W7SYuBKpaWn';

export default api => {
  api.post('/create-payment-intent', async (req, res) => {
    try {
      const order = {
        items: req.body.order.items.map(x => ({
          type: 'sku',
          parent: x.sku_id,
          quantity: +x.quantity,
        })),
        metadata: {
          reg_type: req.body.reg_type,
          reg_response_id: req.body.reg_response_id,
        },
        email: req.body.order.email,
        currency: config.DEFAULT_CURRENCY,
      };
      // if (req.body.order.email) {
      // 	order.email = req.body.order.email;
      // }
      const stripeOrder = await stripe.orders.create(order);

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: stripeOrder.amount,
        currency: config.DEFAULT_CURRENCY,
        metadata: {
          stripeOrderId: stripeOrder.id,
          email: req.body.order.email,
          reg_type: req.body.reg_type,
          reg_response_id: req.body.reg_response_id,
          sku_id: req.body.order.items.map(x => x.sku_id).join(','),
        },
      });
      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        order: stripeOrder,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        clientSecret: null,
        order: null,
        message: err.message,
      });
    }
  });

  api.post('/payment-success', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        throw new Error(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'payment_intent.succeeded') {
        const appParams = JSON.parse(
          (
            await ssm
              .getParameter({
                Name: process.env.SMParameterName,
                WithDecryption: true,
              })
              .promise()
          ).Parameter.Value
        );

        const reg_type = event.data.object.metadata.reg_type;
        const reg_response_id = event.data.object.metadata.reg_response_id;
        const tableName =
          reg_type === 'team'
            ? 'registrations_responses_teams'
            : 'registrations_responses_individuals';

        const conn = await mysql.createConnection(appParams.db);
        const reg_response = (
          await conn.query(
            `select * from registrations.${tableName} where reg_response_id=?`,
            [reg_response_id]
          )
        )[0];

        // Add Stripe stuff here
        reg_response.ext_payment_system = 'stripe';
        reg_response.ext_payment_id = event.data.object.id;
        reg_response.payment_amount = +event.data.object.amount_received / 100;
        reg_response.payment_date = new Date(
          +event.data.object.charges.data[0].created * 1000
        );
        reg_response.payment_method =
          event.data.object.charges.data[0].payment_method_details.type;

        let sql = '';
        let values = '';
        let params = [];
        for (let fieldName in reg_response) {
          sql += fieldName + ',';
          values += '?,';
          params.push(reg_response[fieldName]);
        }
        sql = `INSERT INTO events.${tableName}\n   (${sql.slice(
          0,
          -1
        )}) \nVALUES (${values.slice(0, -1)})`;

        await conn.query(sql, params);
      }
      res.json({
        success: true,
        message: 'OK',
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  });

  return api;
};