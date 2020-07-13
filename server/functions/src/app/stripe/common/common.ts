import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-03-02',
  maxNetworkRetries: 3,
});

export const loadAll = async (
  endpoint: any,
  params: object | null = {},
  requestParams = null
) => {
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
