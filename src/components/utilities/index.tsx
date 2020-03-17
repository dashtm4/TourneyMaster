/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AppState } from './logic/reducer';
import { loadUserData, saveUserData, changeUser } from './logic/actions';
import { ProfileNavigation, ImportNavigation } from './components/navigations';
import UserProfile from './components/user-profile';
import TourneyImport from './components/tourney-import'
import { HeadingLevelTwo, Loader } from 'components/common';
import { BindingAction, BindingCbWithOne, IMember, Location } from 'common/models';
import { IUtilitiesMember } from './types';
import styles from './styles.module.scss';
import Api from 'api/api';

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  location: Location;
  userData: IMember | IUtilitiesMember | null;
  loadUserData: BindingAction;
  saveUserData: BindingAction;
  changeUser: BindingCbWithOne<Partial<IUtilitiesMember>>;
}

const Utilities = ({
  isLoading,
  userData,
  location,
  loadUserData,
  saveUserData,
  changeUser,
}: Props) => {
  const [tournamentLoaded, SetTournamentLoaded] = React.useState(true);
  const [idTournament, setIdTournament] = React.useState('');
  const [jobStatus, setJobStatus] = React.useState<string[]>([]);
  const [events, setEvents] = React.useState('');
  const [games, setGames] = React.useState('');
  const [pools, setPools] = React.useState('');
  const [locations, setLocations] = React.useState('');
  const [dataLoaded, setDataLoaded] = React.useState<Boolean>(false);
  // const [tournamentData, setTournamentData] = React.useState(undefined);

  React.useEffect(() => {
    if (location.hash === '#user-profile') {
      loadUserData();
    }

  }, [location.hash]);

  function startJob() {
    if (idTournament === '' || idTournament === null || idTournament === undefined)
      return false

    SetTournamentLoaded(false);
    Api.post(`/tourneymachine?tid=${idTournament}`, null)
      .then(res => {
        getStatus(res.message.job_id);
      })
      .catch(err => {
        console.log('[On job failed]', err);
      })
  }

  function getStatus(job_id: string) {
    const localJobId = job_id;

    Api.get(`/system_jobs?job_id=${localJobId}`)
      .then(res => {
        SetTournamentLoaded(true);
        dataLoadedHandler(true);

        if (res[0].status.includes('Complete:')) {

          jobStatus.push(statusFilter(res[0].status));
          setJobStatus([...jobStatus]);
          getTournamentData();
        }
        else {
          jobStatus.push(res[0].status);
          setJobStatus([...jobStatus]);
          setTimeout(() => getStatus(localJobId), 5000);
        }
      })
  }

  function statusFilter(status: String) {
    let splitedStatus = status.split(" ").reverse();
    let fixedSecond = parseFloat(splitedStatus[1]).toFixed(2);
    splitedStatus[1] = fixedSecond;
    let updatedStatus = splitedStatus.reverse().join(" ");

    return updatedStatus;
  }

  function getTournamentData() {
    Api.get(`/ext_events?idtournament=${idTournament}`)
      .then(res => {
        setEvents(res);
      })
      .catch(err => {
        console.log(err);
      })

    Api.get(`/ext_games?idtournament=${idTournament}`)
      .then(res => {
        setGames(res);
      })
      .catch(err => {
        console.log(err);
      })

    Api.get(`/ext_pools?idtournament=${idTournament}`)
      .then(res => {
        setPools(res);
      })
      .catch(err => {
        console.log(err);
      })

    Api.get(`/ext_locations?idtournament=${idTournament}`)
      .then(res => {
        setLocations(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  function dataLoadedHandler(dataLoadedProp: Boolean) {
    setDataLoaded(dataLoadedProp);
  }

  function getTid(tId: string) {
    setIdTournament(tId);
  }

  if ((isLoading || !userData) && location.hash === '#user-profile') {
    return <Loader />;
  }

  if (!tournamentLoaded && location.hash === '#tourney-import') {
    return <Loader />;
  }

  return (
    <section>
      <form
        onSubmit={evt => {
          evt.preventDefault();
        }}
      >
        {
          location.hash === '#user-profile' ? <ProfileNavigation onSaveUser={saveUserData} /> : <ImportNavigation onPreview={startJob} dataLoaded={dataLoaded} />
        }
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Utilities</HeadingLevelTwo>
        </div>
        {
          (location.hash === '#user-profile' && userData) ? (
            <UserProfile userData={userData} changeUser={changeUser} />
          ) : (
              location.hash === '#tourney-import' ?
                <TourneyImport
                  onGetTid={getTid}
                  jobStatus={jobStatus}
                  events={events} games={games}
                  pools={pools}
                  locations={locations}
                  onDataLoaded={dataLoadedHandler}
                  dataLoaded={dataLoaded}
                /> : null
            )
        }
      </form>
    </section>
  );
};

interface IRootState {
  utilities: AppState;
}

export default connect(
  ({ utilities }: IRootState) => ({
    isLoading: utilities.isLoading,
    isLoaded: utilities.isLoaded,
    userData: utilities.userData,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        loadUserData,
        changeUser,
        saveUserData,
      },
      dispatch
    )
)(Utilities);
