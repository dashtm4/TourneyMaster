import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../header';
import DashboardMenu from './components/dashboard-menu';
import LibraryManaget from './components/library-manager';
import { Routes } from '../../common/constants';
import styles from './styles.module.scss';

const DashboardPage = () => (
  <>
    <Header />
    <div className={styles.page}>
      <DashboardMenu />
      <main className={styles.content}>
        <Switch>
          <Route path={Routes.LIBRARY} component={LibraryManaget} />
        </Switch>
      </main>
    </div>
  </>
);

export default DashboardPage;
