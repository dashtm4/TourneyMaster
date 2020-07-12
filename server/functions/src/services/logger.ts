import { sendSnsMessage } from './aws-utils';

declare global {
  interface Console {
    logError?(error: Error): Promise<void>;
  }
}

console.logError = async (error: Error) => {
  console.log(error);
  sendSnsMessage(process.env.EVENT_NOTIFICATIONS_TOPIC!, 'Error in Payments', {
    message: error.message,
    stack: error.stack,
  });
};
