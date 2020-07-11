// Send Email via SES
import './services/logger.js';

export const handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));

  try {
    return true;
  } catch (err) {
    console.logError(err);
  }
};
