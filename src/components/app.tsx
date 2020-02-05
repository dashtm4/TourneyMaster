import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './login-page';
import AuthorizedPage from './authorized-page';
import { Routes } from '../common/constants';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path={Routes.LOGIN} component={LoginPage} exact />
          <Route path={Routes.DEFAULT} component={AuthorizedPage} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
