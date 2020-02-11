import Amplify from 'aws-amplify';

export default () => {
  Amplify.configure({
    Auth: {
      mandatorySignId: true,
      region: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
      oauth: {
        domain: process.env.REACT_APP_AWS_COGNITO_DOMAIN,
        redirectSignIn: 'http://localhost:3000/',
        redirectSignOut: 'http://localhost:3000/',
        responseType: 'code',
      },
    },
  });
};
