/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadAuthPageData, clearAuthPageData } from './logic/actions';
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
import { Routes } from 'common/constants';
import { MenuItem, BindingAction } from 'common/models';
import { Loader } from 'components/common';
import styles from '../styles.module.scss';

interface MatchParams {
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  menuList: MenuItem[];
  loadAuthPageData: (eventId: string) => void;
  clearAuthPageData: BindingAction;
}

export const EmptyPage: React.FC = () => {
  return <span> Not implemented yet</span>;
};

const AuthorizedPageEvent = ({
  // isLoading,
  // isLoaded,
  menuList,
  match,
  loadAuthPageData,
}: Props & RouteComponentProps<MatchParams>) => {
  const eventId = match.params.eventId;
  React.useEffect(() => {
    if (eventId) {
      loadAuthPageData(eventId);
    }

    return () => {
      clearAuthPageData();
    };
  }, []);

  return (
    <>
      <Header />
      {false ? (
        <Loader />
      ) : (
        <div className={styles.page}>
          <Menu
            list={menuList}
            eventId={eventId}
            isAllowEdit={Boolean(eventId)}
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
              <Route path={Routes.SCHEDULING_ID} component={Scheduling} />
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
      )}
    </>
  );
};

interface IRootState {
  pageEvent: AppState;
}

export default connect(
  ({ pageEvent }: IRootState) => ({
    isLoading: pageEvent.isLoading,
    isLoaded: pageEvent.isLoaded,
    menuList: pageEvent.menuList,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators({ loadAuthPageData, clearAuthPageData }, dispatch)
)(AuthorizedPageEvent);
