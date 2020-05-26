import {
  processCreateSubscription,
  paymentSuccessWebhook,
} from './stripePayments.js';

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
