import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
      <Router>
        <Switch>
          <Route
            path={Routes.LOGIN}
            component={LoginPageWrapped}
            exact={true}
          />
          <Route path={Routes.LOGIN} component={LoginPage} exact={true} />
          <Route
            path={[
              Routes.DASHBOARD,
              Routes.LIBRARY_MANAGER,
              Routes.EVENT_LINK,
              Routes.COLLABORATION,
              Routes.CALENDAR,
              Routes.UTILITIES,
              Routes.EVENT_DAY_COMPLEXITIES,
            ]}
            component={AuthorizedPageWrapped}
          />
          <Route path={Routes.EVENT} component={AuthorizedPageEventWrapped} />
          <Route path={Routes.DEFAULT} component={AuthorizedPageWrapped} />
        </Switch>
      </Router>
      <Toastr />
    </React.Fragment>
  );
};

export default App;
