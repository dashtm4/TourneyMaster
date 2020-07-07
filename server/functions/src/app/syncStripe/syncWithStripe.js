import {
  getActiveSkus,
  getPaymentPlans,
} from '../../services/activeProducts.js';
import config from '../../config.js';
import Stripe from 'stripe';
import StripeServiceProductsHandler from './stripeServiceProductsHandler.js';
import StripePricesHandler from './stripePricesHandler.js';
import StripeTaxRatesHandler from './stripeTaxRatesHandler.js';

const stripe = Stripe(config.STRIPE_API_SECRET_KEY);

const syncStripeObjects = async (objectClass, source, stripeEndpoint) => {
  try {
    console.log(`Started ${objectClass.constructor.name} synchronization`);

    // console.log(JSON.stringify(source, null, '  '));
    const activeObjects = source.flatMap(objectClass.map);

    const stripeObjects = await objectClass.list();

    let objectsToDelete = [];
    // Create and update products
    for (const object of activeObjects) {
      const matchedStripeObjects = stripeObjects.filter(
        item => item.metadata.externalId === object.metadata.externalId
      );
      if (matchedStripeObjects.length >= 1) {
        const stripeObject = matchedStripeObjects[0];
        if (!objectClass.equal(object, stripeObject)) {
          object.id = stripeObject.id;
          const updatedStripeObject = await objectClass.update(
            object,
            stripeObject
          );
        }
        if (matchedStripeObjects.length > 1) {
          console.error(
            `Deleting duplicate ObjectId: ${
              object.metadata.externalId
            }. Products: ${JSON.stringify(matchedStripeObjects)}`
          );
          objectsToDelete = objectsToDelete.concat(
            matchedStripeObjects.slice(1)
          );
        }
      } else if (matchedStripeObjects.length === 0) {
        objectClass.create(object);
      }
    }
    // Delete products
    objectsToDelete = objectsToDelete.concat(
      stripeObjects.filter(stripeObject => {
        return (
          activeObjects.filter(
            object =>
              object.metadata.externalId === stripeObject.metadata.externalId
          ).length === 0 &&
          stripeObject.active &&
          stripeObject.metadata.externalId
        );
      })
    );
    if (objectsToDelete.length > 0) {
      console.log(
        `Objects to delete:\n * ${objectsToDelete
          .map(x => x.metadata.externalId)
          .join('\n * ')}`
      );
    }
    for (const stripeObject of objectsToDelete) {
      objectClass.delete(stripeObject);
    }
    console.log(`Finished ${objectClass.constructor.name} synchronization`);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const syncTaxRates = async (paymentPlans, stripeAccount) => {
  const salesTaxRates = [
    ...new Set(paymentPlans.map(plan => plan.sales_tax_rate)),
  ].map(sales_tax_rate => ({
    sales_tax_rate: sales_tax_rate,
    display_name: `Tax ${sales_tax_rate}%`,
    description: `Tax ${sales_tax_rate}%`,
    jurisdiction: 'US',
    inclusive: false,
  }));
  await syncStripeObjects(
    new StripeTaxRatesHandler(stripe, stripeAccount),
    salesTaxRates
  );
};

const createSpecialProduct = (stripeAccount, currency) => {
  return {
    product_name: `Payment Schedule`,
    sku_id: `sched_${currency.toLowerCase()}_${stripeAccount}`,
    sku_name: '',
    event_id: 'no',
    division_id: 'no',
    price: 0,
    sales_tax_rate: 0,
    sale_startdate: '0',
    sale_enddate: '0',
  };
};

const syncServiceProducts = async stripeAccount => {
  let activeSkus = await getActiveSkus(stripeAccount);

  const currencies = getCurrencies(activeSkus);

  activeSkus = activeSkus.concat(
    currencies.map(currency => createSpecialProduct(stripeAccount, currency))
  );

  await syncStripeObjects(
    new StripeServiceProductsHandler(stripe, stripeAccount),
    activeSkus
  );
};

const createSpecialPaymentPlan = (stripeAccount, currency) => {
  return {
    type: 'installment',
    currency: currency.toLowerCase(),
    price: 0,
    payment_plan_name: `Payment Schedule`,
    sku_id: `sched_${currency.toLowerCase()}_${stripeAccount}`,
    interval: 'month',
    intervalCount: '12',
    payment_plan_id: `acc_${currency.toLowerCase()}_${stripeAccount}`,
    sku_name: `Payment Schedule`,
    total_price: 0,
    event_id: 'no',
    division_id: 'no',
    owner_id: 'no',
    sales_tax_rate: 0,
    iterations: 0,
    discount: 0,
    billing_cycle_anchor: 0,
  };
};

const getCurrencies = objectsWithCurrenies => {
  return [
    ...new Set(
      objectsWithCurrenies.map(object => object.currency.toLowerCase())
    ),
  ];
};

const syncPrices = async stripeAccount => {
  let activePaymentPlans = await getPaymentPlans({
    stripe_connect_id: stripeAccount,
  });
  const currencies = getCurrencies(activePaymentPlans);

  activePaymentPlans = activePaymentPlans.concat(
    currencies.map(currency =>
      createSpecialPaymentPlan(stripeAccount, currency)
    )
  );
  await syncTaxRates(activePaymentPlans, stripeAccount);
  await syncStripeObjects(
    new StripePricesHandler(stripe, stripeAccount),
    activePaymentPlans
  );
};

const loadAll = async (endpoint, params = {}) => {
  const objects = [];
  for await (const object of endpoint.list({
    ...params,
    limit: 100,
  })) {
    objects.push(object);
  }
  return objects;
};

export const syncWithStripe = async () => {
  const stripeAccounts = (await loadAll(stripe.accounts))
    .filter(account => account.charges_enabled)
    .map(account => account.id);
  stripeAccounts.push('main');
  for (const stripeAccount of stripeAccounts) {
    await syncServiceProducts(stripeAccount);
    await syncPrices(stripeAccount);
  }
};
