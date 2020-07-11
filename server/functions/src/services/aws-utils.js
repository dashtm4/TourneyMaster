import SSM from 'aws-sdk/clients/ssm.js';
import SNS from 'aws-sdk/clients/sns.js';
// import AWS from 'aws-sdk';
// const { config } = AWS;

// config.update({ region: 'us-east-1' });
const sns = new SNS({ apiVersion: '2010-03-31', region: 'us-east-1' });
const ssm = new SSM({ region: 'us-east-1' });

export const getParams = async paramName => {
  return JSON.parse(
    (
      await ssm
        .getParameter({
          Name: paramName,
          WithDecryption: true,
        })
        .promise()
    ).Parameter.Value
  );
};

export const sendSnsMessage = async (topic, subject, message) => {
  let params = {
    Subject: subject,
    Message: typeof message === 'object' ? JSON.stringify(message) : message,
    TopicArn: topic,
  };
  try {
    const data = await sns.publish(params).promise();
    console.log('Response from SNS', data);
  } catch (err) {
    console.error('Error in SNS', err);
  }
};

export const sendEmail = async data => {
  return await sendSnsMessage(process.env.USER_EVENTS_TOPIC, 'SendEmail', data);
};
