import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './login-page';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={LoginPage} />
      </Switch>
    </Router>
  );
};

export default App;
