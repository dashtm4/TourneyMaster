import { getActiveProducts, getActiveSkus } from './activeProducts.js';
import config from '../config.js';
import Stripe from 'stripe';

const stripe = Stripe(config.STRIPE_API_SECRET_KEY);

import StripeProductsHandler from './stripeProductsHandler.js';
import StripeSkusHandler from './stripeSkusHandler.js';

const syncStripeObjects = async (objectClass, source, stripeEndpoint) => {
	try {
		console.log(`Started XXX synchronization`);

		// console.log(JSON.stringify(source, null, '  '));
		const activeObjects = source.map(objectClass.map);

		const stripeObjects = await objectClass.list();

		// Create and update products
		for (const object of activeObjects) {
			const matchedStripeObjects = stripeObjects.filter(
				item => item.id === object.id
			);
			if (matchedStripeObjects.length === 1) {
				const stripeObject = matchedStripeObjects[0];
				if (!objectClass.equal(object, stripeObject)) {
					const updatedStripeObject = await objectClass.update(
						object,
						stripeObject
					);
				}
			} else if (matchedStripeObjects.length === 0) {
				objectClass.create(object);
			} else if (matchedStripeObjects.length > 1) {
				// TODO: Remove this section if we keep Stripe Id = Our Id
				console.error(
					`Duplicate ObjectId: ${object.id}. Productds: ${JSON.stringify(
						matchedStripeObjects
					)}`
				);
			}
		}
		// Delete products
		const objectsToDelete = stripeObjects.filter(stripeObject => {
			return (
				activeObjects.filter(object => object.id === stripeObject.id).length ===
					0 &&
				stripeObject.active &&
				stripeObject.metadata.externalId
			);
		});
		if (objectsToDelete.length > 0) {
			console.log(
				`Objects to delete:\n * ${objectsToDelete.map(x => x.id).join('\n * ')}`
			);
		}
		for (const stripeObject of objectsToDelete) {
			objectClass.delete(stripeObject);
		}
		console.log(`Finished XXX synchronization`);
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const syncProducts = async () => {
	const activeProducts = await getActiveProducts();
	await syncStripeObjects(new StripeProductsHandler(stripe), activeProducts);
};

const syncSkus = async () => {
	const activeSkus = await getActiveSkus();
	await syncStripeObjects(new StripeSkusHandler(stripe), activeSkus);
};

export const syncWithStripe = async () => {
	await syncProducts();
	await syncSkus();
};
