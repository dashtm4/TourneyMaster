import express from 'express';
import cors from 'cors';
import paymentsApi from './routes/paymentsApi.js';
import servicesApi from './routes/servicesApi.js';

import serverlessExpress from 'aws-serverless-express';

const app = express();
const router = express.Router();

app.use(cors());
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf;
    },
  })
);
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl}\nBody: ${JSON.stringify(
      req.body,
      null,
      '  '
    )}`
  );
  next();
});
app.use(['/:publicapi/payments', '/payments'], paymentsApi(router));
app.use(['/:privateapi/services', '/services'], servicesApi(router));

const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
let handler = null;
if (isInLambda) {
  const server = serverlessExpress.createServer(app);
  handler = (event, context) => {
    console.log('Event: ', JSON.stringify(event));
    console.log('Context: ', JSON.stringify(context));
    serverlessExpress.proxy(server, event, context);
  };
} else {
  app.listen(3001, () => console.log(`Listening on 3000`));
}

export { handler };
