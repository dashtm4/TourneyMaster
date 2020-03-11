import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../header';
import Menu from '../common/menu';
import { MenuList } from './logic/constants';
import Dashboard from '../dashboard';
import LibraryManager from '../library-manager';
import OrganizationsManagement from '../organizations-management';
import Calendar from 'components/calendar';
import { EmptyPage } from './authorized-page-event/index';
import Schedules from 'components/schedules';
import { Routes } from 'common/enums';
import styles from './styles.module.scss';

const AuthorizedPage = () => (
  <>
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
  </>
);

export default AuthorizedPage;
