import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './header';
import LoginPage from './login-page';
import DashboardPage from './dashborard-page';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Router>
        <Header />
        <main>
          <Switch>
            <Route path="/" component={LoginPage} exact />
            <Route path="/dashboard" component={DashboardPage} />
          </Switch>
        </main>
      </Router>
    </React.Fragment>
  );
};

export default App;
