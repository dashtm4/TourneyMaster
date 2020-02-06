import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../header';
import Menu from '../common/menu';
import LibraryManager from '../library-manager';
import Facilities from '../facilities';
import MenuList from './constants/MenuList';
import { Routes } from '../../common/constants';
import styles from './styles.module.scss';
import Dashboard from '../dashboard';
import Registration from '../registration-view';

const AuthorizedPage = () => (
  <>
    <Header />
    <div className={styles.page}>
      <Menu list={MenuList} />
      <main className={styles.content}>
        <Switch>
          <Route path={Routes.DASHBOARD} component={Dashboard} />
          <Route path={Routes.LIBRARY_MANAGER} component={LibraryManager} />
          <Route path={Routes.FACILITIES} component={Facilities} />
          <Route path={Routes.REGISTRATION} component={Registration} />
          <Route path={Routes.DEFAULT} component={Dashboard} />
        </Switch>
      </main>
    </div>
  </>
);

export default AuthorizedPage;
