import React from 'react';
import { Switch, Route } from 'react-router-dom';
import withProtectedRoute from '../hocs/withProtectedRoute';
import withUnprotectedRoute from '../hocs/withUnprotectedRoute';
import LoginPage from './login-page';
import AuthorizedPage from './authorized-page';
import { Routes } from 'common/enums';
import AuthorizedPageEvent from './authorized-page/authorized-page-event';
import Toastr from 'components/common/toastr';
import RegisterPage from 'components/register-page';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_O5DTSQoFgT6wdo6VTgQtiPx900GJLklPMh');

const LoginPageWrapped = withUnprotectedRoute(LoginPage);
const RegisterPageWrapped = withUnprotectedRoute(RegisterPage);
const AuthorizedPageWrapped = withProtectedRoute(AuthorizedPage);
const AuthorizedPageEventWrapped = withProtectedRoute(AuthorizedPageEvent);

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Elements stripe={stripePromise}>
        <Switch>
          <Route
            path={Routes.LOGIN}
            component={LoginPageWrapped}
            exact={true}
          />
          <Route
            path={Routes.REGISTER}
            component={RegisterPageWrapped}
            exact={true}
          />
          <Route
            path={[
              Routes.DASHBOARD,
              Routes.LIBRARY_MANAGER,
              Routes.EVENT_LINK,
              Routes.CREATE_MESSAGE,
              Routes.COLLABORATION,
              Routes.CALENDAR,
              Routes.UTILITIES,
              Routes.EVENT_DAY_COMPLEXITIES,
              Routes.ORGANIZATIONS_MANAGEMENT,
            ]}
            component={AuthorizedPageWrapped}
          />
          <Route
            path={[
              Routes.EVENT_DETAILS_ID,
              Routes.FACILITIES_ID,
              Routes.REGISTRATION_ID,
              Routes.DIVISIONS_AND_POOLS_ID,
              Routes.ADD_DIVISION,
              Routes.EDIT_DIVISION,
              Routes.TEAMS_ID,
              Routes.CREATE_TEAM,
              Routes.SCHEDULING_ID,
              Routes.SCORING_ID,
              Routes.REPORTING_ID,
              Routes.RECORD_SCORES_ID,
              Routes.SCHEDULES_ID,
              Routes.PLAYOFFS_ID,
            ]}
            component={AuthorizedPageEventWrapped}
          />
          <Route path={Routes.DEFAULT} component={AuthorizedPageWrapped} />
        </Switch>
        <Toastr />
      </Elements>
    </React.Fragment>
  );
};

export default App;
