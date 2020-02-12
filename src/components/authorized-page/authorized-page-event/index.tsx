import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../../header';
import Menu from '../../common/menu';
import Facilities from '../../facilities';
import { MenuListForEvent } from '../constants/MenuList';
import { Routes } from '../../../common/constants';
import styles from '../styles.module.scss';
import EventDetails from '../../event-details';
import Registration from '../../registration-view';
import { RouteComponentProps } from 'react-router-dom';
import RegistrationEdit from '../../registration-edit';
import DivisionsAndPools from '../../divisions-and-pools';

interface MatchParams {
  eventId?: string;
}

const AuthorizedPageEvent = (props: RouteComponentProps<MatchParams>) => (
  <>
    <Header />
    <div className={styles.page}>
      <Menu list={MenuListForEvent} eventId={props.match.params.eventId} />
      <main className={styles.content}>
        <Switch>
          <Route path={Routes.EVENT_DETAILS} component={EventDetails} />
          <Route path={Routes.FACILITIES} component={Facilities} />
          <Route path={Routes.REGISTRATION} component={Registration} />
          <Route path={Routes.REGISTRATION_EDIT} component={RegistrationEdit} />
          <Route
            path={Routes.DIVISIONS_AND_POOLS}
            component={DivisionsAndPools}
          />
          <Route path={Routes.DEFAULT} component={EventDetails} />
        </Switch>
      </main>
    </div>
  </>
);

export default AuthorizedPageEvent;
