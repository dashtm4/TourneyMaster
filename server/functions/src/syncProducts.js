// Sync products between Events/Registrations and Stripe

import { syncWithStripe } from './services/syncWithStripe.js';

export const handler = async (event, context) => {
	console.log('Event:', JSON.stringify(event, null, 2));
	console.log('Context:', JSON.stringify(context, null, 2));

	await syncWithStripe();
};
