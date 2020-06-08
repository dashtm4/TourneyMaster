import {
  processCreateSubscription,
  paymentSuccessWebhook,
} from './stripePayments.js';
import { getPaymentPlans } from '../services/activeProducts.js';

export default api => {
  api.post('/create-subscription', async (req, res) => {
    try {
      const subscription = await processCreateSubscription(req.body);

      res.json({
        success: true,
        subscription: subscription,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        subscription: null,
        message: err.message,
      });
    }
  });

  api.get('/payment-plans', async (req, res) => {
    try {
      const sku_id = req.query.sku_id;
      const product_id = req.query.product_id;
      const payment_plan_id = req.query.payment_plan_id;
      const data = await getPaymentPlans({
        sku_id,
        product_id,
        payment_plan_id,
      });

      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  });

  api.post('/payment-success', async (req, res) => {
    try {
      await paymentSuccessWebhook(req);

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
