import { sendSnsMessage } from './aws-utils.js';

console.logError = async error => {
  console.log(error);
  sendSnsMessage(process.env.EVENT_NOTIFICATIONS_TOPIC, 'Error in Payments', {
    message: error.message,
    stack: error.stack,
  });
};
