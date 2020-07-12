import Stripe from 'stripe';

export const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  maxNetworkRetries: 3, // Retry a request twice before giving up
});

export const loadAll = async (endpoint, params = {}, requestParams = null) => {
  const objects = [];
  for await (const object of endpoint.list(
    {
      ...params,
      limit: 100,
    },
    requestParams
  )) {
    objects.push(object);
  }
  return objects;
};
