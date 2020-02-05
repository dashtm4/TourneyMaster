import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../header';
import Menu from '../common/menu';
import LibraryManaget from '../library-manager';
import MenuList from './constants/MenuList';
import { Routes } from '../../common/constants';
import styles from './styles.module.scss';
import Dashboard from '../dashboard';
import EventDetails from 'components/event-details';

const AuthorizedPage = () => (
  <>
    <Header />
    <div className={styles.page}>
      <Menu list={MenuList} />
      <main className={styles.content}>
        <Switch>
          <Route path={Routes.DASHBOARD} component={Dashboard} />
          <Route path={Routes.LIBRARY_MANAGER} component={LibraryManaget} />
          <Route path={Routes.EVENT_DETAILS} component={EventDetails} />
        </Switch>
      </main>
    </div>
  </>
);

export default AuthorizedPage;
