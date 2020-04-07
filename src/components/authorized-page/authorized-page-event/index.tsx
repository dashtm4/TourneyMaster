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
import { IAppState } from 'reducers/root-reducer.types';
import Header from 'components/header';
import { Loader, Menu, ScrollTopButton } from 'components/common';
import Facilities from 'components/facilities';
import Scoring from 'components/scoring';
import RecordScores from 'components/scoring/pages/record-scores';
import EventDetails from 'components/event-details';
import Registration from 'components/registration';
import { RouteComponentProps } from 'react-router-dom';
import DivisionsAndPools from 'components/divisions-and-pools';
import AddDivision from 'components/divisions-and-pools/add-division';
import Scheduling from 'components/scheduling';
import Teams from 'components/teams';
import CreateTeam from 'components/teams/components/create-team';
import Footer from 'components/footer';
import Schedules from 'components/schedules';
import Reporting from 'components/reporting';
import Playoffs from 'components/playoffs';
import { IMenuItem, BindingAction, ITournamentData } from 'common/models';
import { Routes, EventMenuTitles, EventStatuses } from 'common/enums';
import { getIncompleteMenuItems } from '../helpers';
import styles from '../styles.module.scss';
import { closeFullscreen, openFullscreen } from 'helpers';

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
  return <span> Coming soon...</span>;
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
  const [isFullScreen, toggleFullScreen] = React.useState<boolean>(false);
  const onToggleFullScreen = () => {
    toggleFullScreen(!isFullScreen);

    isFullScreen ? closeFullscreen() : openFullscreen(document.documentElement);
  };
  const eventId = match.params.eventId;
  const { event } = tournamentData;

  const onFullScreen = () => {
    if (!document.fullscreen) {
      toggleFullScreen(false);
    }
  };

  React.useEffect(() => {
    if (eventId) {
      loadAuthPageData(eventId);
    }

    return () => clearAuthPageData();
  }, [eventId]);

  React.useEffect(() => {
    isFullScreen
      ? window.addEventListener('fullscreenchange', onFullScreen)
      : window.removeEventListener('fullscreenchange', onFullScreen);

    return () => window.removeEventListener('fullscreenchange', onFullScreen);
  }, [isFullScreen]);

  const hideOnList = [Routes.SCHEDULES, Routes.RECORD_SCORES, Routes.PLAYOFFS];
  const schedulingIgnoreList = [
    EventMenuTitles.SCHEDULING,
    EventMenuTitles.SCORING,
  ];
  const scoringIgnoreList = [EventMenuTitles.SCORING];
  const reportingIgnoreList = [EventMenuTitles.REPORTING];

  if (eventId && !isLoaded) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      {!isFullScreen && <Header />}
      <div className={styles.page}>
        <Menu
          list={menuList}
          eventId={eventId}
          hideOnList={hideOnList}
          isAllowEdit={Boolean(eventId)}
          tournamentStatus={event?.event_status}
          eventName={event?.event_name || ''}
          changeTournamentStatus={changeTournamentStatus}
        />
        <main
          className={`${styles.content} ${
            isFullScreen ? styles.contentFullScreen : ''
          }`}
        >
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
                  incompleteMenuItems={getIncompleteMenuItems(
                    menuList,
                    schedulingIgnoreList
                  )}
                />
              )}
            />
            <Route
              path={Routes.SCHEDULES_ID}
              render={props => (
                <Schedules
                  {...props}
                  isFullScreen={isFullScreen}
                  onToggleFullScreen={onToggleFullScreen}
                />
              )}
            />
            <Route path={Routes.PLAYOFFS_ID} component={Playoffs} />
            <Route path={Routes.TEAMS_ID} component={Teams} />
            <Route
              path={Routes.SCORING_ID}
              render={props => (
                <Scoring
                  {...props}
                  incompleteMenuItems={getIncompleteMenuItems(
                    menuList,
                    scoringIgnoreList
                  )}
                />
              )}
            />
            <Route
              path={Routes.REPORTING_ID}
              render={props => (
                <Reporting
                  {...props}
                  incompleteMenuItems={getIncompleteMenuItems(
                    menuList,
                    reportingIgnoreList
                  )}
                />
              )}
            />
            <Route
              path={Routes.RECORD_SCORES_ID}
              render={props => (
                <RecordScores
                  {...props}
                  isFullScreen={isFullScreen}
                  onToggleFullScreen={onToggleFullScreen}
                />
              )}
            />
            <Route path={Routes.ADD_DIVISION} component={AddDivision} />
            <Route path={Routes.EDIT_DIVISION} component={AddDivision} />
            <Route path={Routes.CREATE_TEAM} component={CreateTeam} />
            <Route path={Routes.DEFAULT} component={EventDetails} />
          </Switch>
          <ScrollTopButton />
        </main>
      </div>
      {!isFullScreen && <Footer />}
    </div>
  );
};

export default connect(
  ({ pageEvent }: IAppState) => ({
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
