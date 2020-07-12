import fs from 'fs';
import { SQSEvent, Context } from 'aws-lambda';
import { handler } from '../sendEmail';

const event: SQSEvent = JSON.parse(
  fs.readFileSync('../src/test/sendEmailSqsMessage.json', {
    encoding: 'utf-8',
  })
);

handler(event);
