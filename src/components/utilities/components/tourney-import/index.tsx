/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Import from './import';
import History from './history';
import { Navigation } from './navigation';
import { HeadingLevelTwo, Loader } from 'components/common';
import styles from './styles.module.scss';
import Api from 'api/api';

const TourneyImportWizard = () => {
  const [tournamentLoaded, SetTournamentLoaded] = React.useState(true);
  const [idTournament, setIdTournament] = React.useState('');
  const [jobStatus, setJobStatus] = React.useState<string[]>([]);
  const [events, setEvents] = React.useState('');
  const [games, setGames] = React.useState('');
  const [locations, setLocations] = React.useState('');
  const [dataLoaded, setDataLoaded] = React.useState<Boolean>(false);
  const [completed, setCompleted] = React.useState(0);


  function Progress() {
    setCompleted(oldCompleted => {
      if (oldCompleted > 90) {
        return 90;
      }

      const diff = Math.random() * 2;
      return Math.min(oldCompleted + diff, 100);
    });

    if (completed >= 90) {
      return false;
    }
    else {
      setTimeout(() => {
        Progress();
      }, 500);
    }
  };

  function startJob() {
    Progress();

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
          setCompleted(100);
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

  if (!tournamentLoaded) {
    return <Loader />;
  }

  return (
    <section>
      <form
        onSubmit={evt => {
          evt.preventDefault();
        }}
      >

        <Navigation />
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>External Tourney Import Wizard</HeadingLevelTwo>
        </div>

        <Import
          onGetTid={getTid}
          jobStatus={jobStatus}
          events={events} games={games}
          locations={locations}
          onDataLoaded={dataLoadedHandler}
          dataLoaded={dataLoaded}
          onPreview={startJob}
          completed={completed}
        />

        <History />
      </form>
    </section>
  );
};

export default TourneyImportWizard;
