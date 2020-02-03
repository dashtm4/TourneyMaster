import Amplify from 'aws-amplify';
import config from './config.json';

export default () => {
  const isProd = process.env.NODE_ENV !== 'production';
  Amplify.configure({
    Auth: {
      mandatorySignId: true,
      region: isProd ? process.env.AWS_REGION : config.cognito.REGION,
      userPoolId: isProd
        ? process.env.AWS_USER_POOL_ID
        : config.cognito.USER_POOL_ID,
      userPoolWebClientId: isProd
        ? process.env.AWS_USER_POOL_WEB_CLIENT_ID
        : config.cognito.APP_CLIENT_ID,
      oauth: {
        domain: isProd ? process.env.AWS_COGNITO_DOMAIN : config.cognito.DOMAIN,
        redirectSignIn: 'http://localhost:3000/',
        redirectSignOut: 'http://localhost:3000/',
        responseType: 'token',
      },
    },
  });
};
