import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../header';
import Menu from '../common/menu';
import { MenuList } from './logic/constants';
import Dashboard from '../dashboard';
import LibraryManager from '../library-manager';
import OrganizationsManagement from '../organizations-management';
import Calendar from 'components/calendar';
import Utilities from 'components/utilities';
import { EmptyPage } from './authorized-page-event/index';
import Footer from 'components/footer';
import { Routes } from 'common/enums';
import styles from './styles.module.scss';
import GamedayComplexities from 'components/gameday-complexities';

import ReactPDF from 'pdg-layouts/schedule-table';

const AuthorizedPage = () => (
  <div className={styles.container}>
    <Header />
    <div className={styles.page}>
      <Menu list={MenuList} isAllowEdit={true} />
      <main className={styles.content}>
        <Switch>
          <Route path={Routes.REACT_PDF} component={ReactPDF} />
          <Route path={Routes.DASHBOARD} component={Dashboard} />
          <Route path={Routes.LIBRARY_MANAGER} component={LibraryManager} />
          <Route path={Routes.EVENT_LINK} component={EmptyPage} />
          <Route
            path={Routes.COLLABORATION}
            component={OrganizationsManagement}
          />
          <Route path={Routes.CALENDAR} component={Calendar} />
          <Route path={Routes.UTILITIES} component={Utilities} />
          <Route
            path={Routes.EVENT_DAY_COMPLEXITIES}
            component={GamedayComplexities}
          />
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
