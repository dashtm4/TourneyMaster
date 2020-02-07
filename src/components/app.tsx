import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './login-page';
import AuthorizedPage from './authorized-page';
import { Routes } from '../common/constants';
import AuthorizedPageManagement from './authorized-page/authorized-manage-page';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
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
            component={AuthorizedPage}
          />
          <Route
            path={[
              Routes.EVENT_DETAILS,
              Routes.FACILITIES,
              Routes.REGISTRATION,
              Routes.DIVISIONS_AND_POOLS,
              Routes.TEAMS,
              Routes.SCHEDULING,
              Routes.SCORING,
              Routes.REPORTING,
            ]}
            component={AuthorizedPageManagement}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
