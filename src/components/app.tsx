import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './login-page';
import DashboardPage from './dashborard-page';
import { Routes } from '../common/constants';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path={Routes.LOGIN} component={LoginPage} exact />
          <Route path={Routes.DASHBOARD} component={DashboardPage} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
