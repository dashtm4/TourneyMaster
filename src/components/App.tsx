import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './login-page';
import Header from './header';
import Dashboard from './dashboard';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Router>
        <Header />
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/" component={LoginPage} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
