import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../../header';
import Menu from '../../common/menu';
import Facilities from '../../facilities';
import { MenuListForManagement } from '../constants/MenuList';
import { Routes } from '../../../common/constants';
import styles from '../styles.module.scss';
import EventDetails from '../../event-details';
import Registration from '../../registration-view';

const AuthorizedPageManagement = () => (
  <>
    <Header />
    <div className={styles.page}>
      <Menu list={MenuListForManagement} />
      <main className={styles.content}>
        <Switch>
          <Route path={Routes.EVENT_DETAILS} component={EventDetails} />
          <Route path={Routes.FACILITIES} component={Facilities} />
          <Route path={Routes.REGISTRATION} component={Registration} />
          <Route path={Routes.DEFAULT} component={EventDetails} />
        </Switch>
      </main>
    </div>
  </>
);

export default AuthorizedPageManagement;
