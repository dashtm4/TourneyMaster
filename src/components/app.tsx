import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './login-page';
import Header from '../components/header';
import DashboardMenu from './common/dashboard-menu';
import LibraryManaget from './library-manager';
import { Routes } from '../common/constants';
import styles from './dashborard-page/styles.module.scss';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path={Routes.LOGIN} component={LoginPage} exact />
          <Route
            path={Routes.DEFAULT}
            render={() => {
              return (
                <>
                  <Header />
                  <div className={styles.page}>
                    <DashboardMenu />
                    <main className={styles.content}>
                      <Switch>
                        <Route
                          path={Routes.LIBRARY_MANAGER}
                          component={LibraryManaget}
                        />
                      </Switch>
                    </main>
                  </div>
                </>
              );
            }}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
