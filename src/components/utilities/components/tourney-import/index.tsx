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
  const [jobStatus, setJobStatus] = React.useState<any[]>([]);
  const [events, setEvents] = React.useState<any[]>([]);
  const [games, setGames] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = React.useState<Boolean>(false);
  const [completed, setCompleted] = React.useState(0);

  React.useEffect(() => {
    function progress() {
      setCompleted(oldCompleted => {
        const diff = Math.random() * 0.6;
        return Math.min(oldCompleted + diff, 100);
      });
    }

    const timer = setInterval(progress, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

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

    Api.get(`/system_jobs_view?job_id=${localJobId}`)
      .then(res => {
        SetTournamentLoaded(true);
        dataLoadedHandler(true);
        setJobStatus(res);
        if (res[0].is_complete_YN === 1) {
          setCompleted(100);
          getTournamentData();
        }
        else {
          setTimeout(() => getStatus(localJobId), 5000);
        }
      })
  }

  // function statusFilter(status: String) {
  //   let splitedStatus = status.split(" ").reverse();
  //   let fixedSecond = parseFloat(splitedStatus[1]).toFixed(2);
  //   splitedStatus[1] = fixedSecond;
  //   let updatedStatus = splitedStatus.reverse().join(" ");

  //   return updatedStatus;
  // }

  function distinctFilter(data: Array<any>, filterBy: string) {
    let flags: Array<any> = [];
    let output: Array<any> = [];
    const length: number = data.length;
    let i: number;

    for (i = 0; i < length; i++) {
      if (flags[data[i][filterBy]]) continue;
      flags[data[i].name] = true;
      output.push(data[i]);
    }

    return output;
  }

  function getTournamentData() {
    Api.get(`/ext_events?idtournament=${idTournament}`)
      .then(res => {
        setEvents(distinctFilter(res, 'name'));
      })
      .catch(err => {
        console.log(err);
      })

    Api.get(`/ext_games?idtournament=${idTournament}`)
      .then(res => {
        setGames(distinctFilter(res, 'Name'));
      })
      .catch(err => {
        console.log(err);
      })

    Api.get(`/ext_locations?idtournament=${idTournament}`)
      .then(res => {
        setLocations(distinctFilter(res, 'tournament_name'));
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
