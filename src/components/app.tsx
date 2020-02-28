import React from 'react';
import { Switch, Route } from 'react-router-dom';
import withProtectedRoute from '../hocs/withProtectedRoute';
import withUnprotectedRoute from '../hocs/withUnprotectedRoute';
import LoginPage from './login-page';
import AuthorizedPage from './authorized-page';
import { Routes } from '../common/constants';
import AuthorizedPageEvent from './authorized-page/authorized-page-event';
import Toastr from 'components/common/toastr';

const LoginPageWrapped = withUnprotectedRoute(LoginPage);
const AuthorizedPageWrapped = withProtectedRoute(AuthorizedPage);
const AuthorizedPageEventWrapped = withProtectedRoute(AuthorizedPageEvent);

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={Routes.LOGIN} component={LoginPageWrapped} exact={true} />
        <Route
          path={[
            Routes.DASHBOARD,
            Routes.LIBRARY_MANAGER,
            Routes.EVENT_LINK,
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
            Routes.EVENT_DETAILS,
            Routes.FACILITIES,
            Routes.REGISTRATION,
            Routes.DIVISIONS_AND_POOLS,
            Routes.ADD_DIVISION,
            Routes.EDIT_DIVISION,
            Routes.TEAMS,
            Routes.CREATE_TEAM,
            Routes.SCHEDULING,
            Routes.SCORING_ID,
            Routes.REPORTING,
            Routes.RECORD_SCORES_ID,
          ]}
          component={AuthorizedPageEventWrapped}
        />
        <Route path={Routes.DEFAULT} component={AuthorizedPageWrapped} />
      </Switch>
      <Toastr />
    </React.Fragment>
  );
};

export default App;
