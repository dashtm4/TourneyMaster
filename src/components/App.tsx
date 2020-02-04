import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './login-page';
import Dashboard from './dashboard';
import { Routes } from '../common/constants';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path={Routes.DASHBOARD} component={Dashboard} />
          <Route path={Routes.LOGIN} component={LoginPage} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
