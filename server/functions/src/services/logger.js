import AWS from 'aws-sdk';
const { config, SNS } = AWS;

config.update({ region: 'us-east-1' });
const sns = new SNS({ apiVersion: '2010-03-31' });

console.logError = async (error) => {
  console.log(error);

  let params = {
    Subject: 'Error in Payments',
    Message: JSON.stringify({ message: error.message, stack: error.stack }),
    TopicArn: process.env.EVENT_NOTIFICATIONS_TOPIC,
  };
  try {
    const data = await sns.publish(params).promise();
    console.log('Response from SNS', data);
  } catch (err) {
    console.error('Error in SNS', err);
  }
};
