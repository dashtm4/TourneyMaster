import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from 'components/header';
import Menu from 'components/common/menu';
import Facilities from 'components/facilities';
import Sсoring from 'components/scoring';
import EventDetails from 'components/event-details';
import Registration from 'components/registration';
import { RouteComponentProps } from 'react-router-dom';
import DivisionsAndPools from 'components/divisions-and-pools';
import AddDivision from 'components/divisions-and-pools/add-division';
import Scheduling from 'components/scheduling';
import Teams from 'components/teams';
import { Routes } from 'common/constants';
import { MenuListForEvent } from '../constants/MenuList';
import styles from '../styles.module.scss';
import CreateTeam from '../../teams/components/create-team';

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
          <Route path={Routes.ADD_DIVISION} component={AddDivision} />
          <Route path={Routes.EDIT_DIVISION} component={AddDivision} />
          <Route
            path={Routes.DIVISIONS_AND_POOLS}
            component={DivisionsAndPools}
          />
          <Route path={Routes.TEAMS} component={Teams} />
          <Route path={Routes.TEAMS} component={EmptyPage} />
          <Route path={Routes.CREATE_TEAM} component={CreateTeam} />
          <Route path={Routes.SCHEDULING} component={Scheduling} />
          <Route path={Routes.SCORING} component={EmptyPage} />
          <Route path={Routes.REPORTING} component={EmptyPage} />

          <Route path={Routes.DEFAULT} component={EventDetails} />
        </Switch>
      </main>
    </div>
  </>
);

export default AuthorizedPageEvent;
