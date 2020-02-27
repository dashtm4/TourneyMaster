import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../header';
import Menu from '../common/menu';
import { MenuList } from './constants/MenuList';
import { Routes } from '../../common/constants';
import styles from './styles.module.scss';
import Dashboard from '../dashboard';
import LibraryManager from '../library-manager';
import Calendar from 'components/calendar';
import { EmptyPage } from './authorized-page-event/index';
import Schedules from 'components/schedules';

const AuthorizedPage = () => (
  <>
    <Header />
    <div className={styles.page}>
      <Menu list={MenuList} />
      <main className={styles.content}>
        <Switch>
          <Route path={Routes.SCHEDULES} component={Schedules} />
          <Route path={Routes.DASHBOARD} component={Dashboard} />
          <Route path={Routes.LIBRARY_MANAGER} component={LibraryManager} />
          <Route path={Routes.EVENT_LINK} component={EmptyPage} />
          <Route path={Routes.COLLABORATION} component={EmptyPage} />
          <Route path={Routes.CALENDAR} component={Calendar} />
          <Route path={Routes.UTILITIES} component={EmptyPage} />
          <Route path={Routes.EVENT_DAY_COMPLEXITIES} component={EmptyPage} />
          <Route path={Routes.DEFAULT} component={Dashboard} />
        </Switch>
      </main>
    </div>
  </>
);

export default AuthorizedPage;
