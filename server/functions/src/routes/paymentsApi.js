import '../services/logger';
import { processCreateSubscription } from '../app/stripe/subscriptions/subscriptions.js';
import { paymentSuccessWebhook } from '../app/stripe/webhooks/webhook.js';
import { getPaymentPlans } from '../app/products/activeProducts.js';

export default api => {
  api.post('/create-subscription', async (req, res) => {
    try {
      const subscription = await processCreateSubscription(req.body);

      res.json({
        success: true,
        subscription: subscription,
      });
    } catch (err) {
      console.logError(err);
      res.json({
        success: false,
        subscription: null,
        message: err.message,
      });
    }
  });

  api.get('/payment-plans', async (req, res) => {
    try {
      const { sku_id, product_id, payment_plan_id, discount_code } = req.query;
      const data = await getPaymentPlans({
        sku_id,
        product_id,
        discount_code,
        payment_plan_id,
      });

      res.json(data);
    } catch (err) {
      console.logError(err);
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
      console.logError(err);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  });

  return api;
};
