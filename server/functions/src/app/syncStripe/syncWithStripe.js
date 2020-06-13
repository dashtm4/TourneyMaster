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

    const stripeObjects = await objectClass.list({ active: true });

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

const syncTaxRates = async paymentPlans => {
  const salesTaxRates = [
    ...new Set(paymentPlans.map(plan => plan.sales_tax_rate)),
  ].map(sales_tax_rate => ({
    sales_tax_rate: sales_tax_rate,
    display_name: `Tax ${sales_tax_rate}%`,
    description: `Tax ${sales_tax_rate}%`,
    jurisdiction: 'US',
    inclusive: true,
  }));
  await syncStripeObjects(new StripeTaxRatesHandler(stripe), salesTaxRates);
};

const syncServiceProducts = async () => {
  const activeSkus = await getActiveSkus();
  await syncStripeObjects(new StripeServiceProductsHandler(stripe), activeSkus);
};

const syncPrices = async () => {
  const activePaymentPlans = await getPaymentPlans({});
  await syncTaxRates(activePaymentPlans);
  await syncStripeObjects(new StripePricesHandler(stripe), activePaymentPlans);
};

export const syncWithStripe = async () => {
  await syncServiceProducts();
  await syncPrices();
};
