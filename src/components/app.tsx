import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import withProtectedRoute from '../hocs/withProtectedRoute';
import withUnprotectedRoute from '../hocs/withUnprotectedRoute';
import LoginPage from './login-page';
import AuthorizedPage from './authorized-page';
import { Routes } from '../common/constants';

const LoginPageWrapped = withUnprotectedRoute(LoginPage);
const AuthorizedPageWrapped = withProtectedRoute(AuthorizedPage);

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
          <Route path={Routes.DEFAULT} component={AuthorizedPageWrapped} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
