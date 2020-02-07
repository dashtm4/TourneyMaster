import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './login-page';
import AuthorizedPage from './authorized-page';
import { Routes } from '../common/constants';
import Toastr from 'components/common/toastr';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path={Routes.LOGIN} component={LoginPage} exact={true} />
          <Route path={Routes.DEFAULT} component={AuthorizedPage} />
        </Switch>
      </Router>
      <Toastr />
    </React.Fragment>
  );
};

export default App;
