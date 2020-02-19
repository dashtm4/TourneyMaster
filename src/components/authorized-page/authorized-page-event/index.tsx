import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../../header';
import Menu from '../../common/menu';
import Facilities from '../../facilities';
import Sсoring from '../../scoring';
import { MenuListForEvent } from '../constants/MenuList';
import EventDetails from '../../event-details';
import Registration from '../../registration-view';
import { RouteComponentProps } from 'react-router-dom';
import RegistrationEdit from '../../registration-edit';
import DivisionsAndPools from '../../divisions-and-pools';
import AddDivision from '../../divisions-and-pools/add-division';
import Teams from '../../teams';
import { Routes } from '../../../common/constants';
import styles from '../styles.module.scss';

interface MatchParams {
  eventId?: string;
}

export const EmptyPage: React.FC = () => {
  return <span> Not implemented yet</span>;
};

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
          <Route
            path={Routes.SCORING}
            eventId={props.match.params.eventId}
            component={Sсoring}
          />
          <Route path={Routes.REGISTRATION_EDIT} component={RegistrationEdit} />
          <Route path={Routes.ADD_DIVISION} component={AddDivision} />
          <Route
            path={Routes.DIVISIONS_AND_POOLS}
            component={DivisionsAndPools}
          />
          <Route path={Routes.TEAMS} component={Teams} />
          <Route path={Routes.TEAMS} component={EmptyPage} />
          <Route path={Routes.SCHEDULING} component={EmptyPage} />
          <Route path={Routes.SCORING} component={EmptyPage} />
          <Route path={Routes.REPORTING} component={EmptyPage} />

          <Route path={Routes.DEFAULT} component={EventDetails} />
        </Switch>
      </main>
    </div>
  </>
);

export default AuthorizedPageEvent;
