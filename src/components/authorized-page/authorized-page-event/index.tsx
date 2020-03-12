/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  loadAuthPageData,
  clearAuthPageData,
  changeTournamentStatus,
} from './logic/actions';
import { AppState } from './logic/reducer';
import Header from 'components/header';
import Menu from 'components/common/menu';
import Facilities from 'components/facilities';
import Sсoring from 'components/scoring';
import RecordScores from 'components/scoring/pages/record-scores';
import EventDetails from 'components/event-details';
import Registration from 'components/registration';
import { RouteComponentProps } from 'react-router-dom';
import DivisionsAndPools from 'components/divisions-and-pools';
import AddDivision from 'components/divisions-and-pools/add-division';
import Scheduling from 'components/scheduling';
import Teams from 'components/teams';
import CreateTeam from 'components/teams/components/create-team';
import { IMenuItem, BindingAction, ITournamentData } from 'common/models';
import {
  Routes,
  RequiredMenuKeys,
  EventMenuTitles,
  EventStatuses,
} from 'common/enums';
import { Loader } from 'components/common';
import styles from '../styles.module.scss';
import Footer from 'components/footer';

interface MatchParams {
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  menuList: IMenuItem[];
  tournamentData: ITournamentData;
  loadAuthPageData: (eventId: string) => void;
  clearAuthPageData: BindingAction;
  changeTournamentStatus: (status: EventStatuses) => void;
}

export const EmptyPage: React.FC = () => {
  return <span> Not implemented yet</span>;
};

const AuthorizedPageEvent = ({
  match,
  isLoaded,
  menuList,
  tournamentData,
  loadAuthPageData,
  clearAuthPageData,
  changeTournamentStatus,
}: Props & RouteComponentProps<MatchParams>) => {
  const eventId = match.params.eventId;
  const { event } = tournamentData;
  React.useEffect(() => {
    if (eventId) {
      loadAuthPageData(eventId);
    }

    return () => {
      clearAuthPageData();
    };
  }, [eventId]);

  if (eventId && !isLoaded) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.page}>
        <Menu
          list={menuList}
          eventId={eventId}
          isAllowEdit={Boolean(eventId)}
          tournamentStatus={event?.event_status}
          eventName={event?.event_name || ''}
          changeTournamentStatus={changeTournamentStatus}
        />
        <main className={styles.content}>
          <Switch>
            <Route path={Routes.EVENT_DETAILS_ID} component={EventDetails} />
            <Route path={Routes.FACILITIES_ID} component={Facilities} />
            <Route path={Routes.REGISTRATION_ID} component={Registration} />
            <Route
              path={Routes.DIVISIONS_AND_POOLS_ID}
              component={DivisionsAndPools}
            />
            <Route
              path={Routes.SCHEDULING_ID}
              render={props => (
                <Scheduling
                  {...props}
                  incompleteMenuItems={menuList.filter(
                    it =>
                      it.hasOwnProperty(RequiredMenuKeys.IS_COMPLETED) &&
                      !it.isCompleted &&
                      it.title !== EventMenuTitles.SCHEDULING
                  )}
                />
              )}
            />
            <Route path={Routes.TEAMS_ID} component={Teams} />
            <Route path={Routes.SCORING_ID} component={Sсoring} />
            <Route path={Routes.REPORTING_ID} component={EmptyPage} />

            <Route path={Routes.RECORD_SCORES_ID} component={RecordScores} />
            <Route path={Routes.ADD_DIVISION} component={AddDivision} />
            <Route path={Routes.EDIT_DIVISION} component={AddDivision} />
            <Route path={Routes.CREATE_TEAM} component={CreateTeam} />

            <Route path={Routes.DEFAULT} component={EventDetails} />
          </Switch>
        </main>
      </div>
      <Footer />
    </div>
  );
};

interface IRootState {
  pageEvent: AppState;
}

export default connect(
  ({ pageEvent }: IRootState) => ({
    tournamentData: pageEvent.tournamentData,
    isLoading: pageEvent.isLoading,
    isLoaded: pageEvent.isLoaded,
    menuList: pageEvent.menuList,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { loadAuthPageData, clearAuthPageData, changeTournamentStatus },
      dispatch
    )
)(AuthorizedPageEvent);
