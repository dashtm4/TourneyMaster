import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../header';
import Menu from '../common/menu';
import { MenuList } from './constants/MenuList';
import { Routes } from '../../common/constants';
import styles from './styles.module.scss';
import Dashboard from '../dashboard';
import LibraryManager from '../library-manager';
import OrganizationsManagement from '../organizations-management';
import Calendar from 'components/calendar';
import { EmptyPage } from './authorized-page-event/index';
import Schedules from 'components/schedules';
import Footer from 'components/footer';

const AuthorizedPage = () => (
  <div className={styles.container}>
    <Header />
    <div className={styles.page}>
      <Menu list={MenuList} isAllowEdit={true} />
      <main className={styles.content}>
        <Switch>
          <Route path={Routes.SCHEDULES} component={Schedules} />
          <Route path={Routes.DASHBOARD} component={Dashboard} />
          <Route path={Routes.LIBRARY_MANAGER} component={LibraryManager} />
          <Route path={Routes.EVENT_LINK} component={EmptyPage} />
          <Route
            path={Routes.COLLABORATION}
            component={OrganizationsManagement}
          />
          <Route path={Routes.CALENDAR} component={Calendar} />
          <Route path={Routes.UTILITIES} component={EmptyPage} />
          <Route path={Routes.EVENT_DAY_COMPLEXITIES} component={EmptyPage} />
          <Route
            path={Routes.ORGANIZATIONS_MANAGEMENT}
            component={OrganizationsManagement}
          />
          <Route path={Routes.DEFAULT} component={Dashboard} />
        </Switch>
      </main>
    </div>
    <Footer />
  </div>
);

export default AuthorizedPage;
