import { union, keys, filter, find, orderBy } from 'lodash-es';
import Scheduler from 'components/schedules/Scheduler';
import { calculateTeamTournamentTime } from '../teamsDiagnostics';
import { getTimeFromString, timeToString } from 'helpers';

const calculateDivisionFieldsNumber = (
  divisionId: string,
  schedulerResult: Scheduler
) => {
  const { teamCards } = schedulerResult;

  const divisionTeamsFields = teamCards
    .filter(teamCard => teamCard.divisionId === divisionId)
    .map(teamCard => teamCard.fieldId)
    .filter(fieldId => fieldId);

  const fieldsNum = union(divisionTeamsFields).length;
  return fieldsNum;
};

const calculateDivisionTournamentTime = (
  divisionId: string,
  schedulerResult: Scheduler
) => {
  const { teamCards, updatedGames, totalGameTime } = schedulerResult;

  const teams = filter(teamCards, ['divisionId', divisionId]);
  const teamsTournamentTime = teams.map(team =>
    calculateTeamTournamentTime(team, updatedGames, totalGameTime)
  );
  const tournamentTimeTotal = teamsTournamentTime
    .map(time => getTimeFromString(time, 'minutes'))
    .reduce((a, b) => a + b);
  const avgTournamentTime = Math.round(tournamentTimeTotal / teams.length);

  return timeToString(avgTournamentTime);
};

const getTournamentTimeBy = (
  divisionId: string,
  schedulerResult: Scheduler,
  orderedBy: 'min' | 'max'
) => {
  const { teamCards, updatedGames, totalGameTime } = schedulerResult;
  const teams = filter(teamCards, ['divisionId', divisionId]);
  const teamsTournamentTime = teams.map(team =>
    calculateTeamTournamentTime(team, updatedGames, totalGameTime)
  );
  switch (orderedBy) {
    case 'max':
      return orderBy(teamsTournamentTime, [], 'desc')[0];
    default:
      return orderBy(teamsTournamentTime, [], 'asc')[0];
  }
};

const calculateDivisionDiagnostics = (
  divisionId: string,
  schedulerResult: Scheduler
) => {
  const {
    divisions,
    facilities,
    facilityData,
    updatedGames,
    teamCards,
  } = schedulerResult;

  const divisionName = find(divisions, ['id', divisionId])?.name;
  const numOfTeams = filter(teamCards, ['divisionId', divisionId])?.length;
  const numOfGames = updatedGames.filter(
    game => (game.awayTeam || game.homeTeam)?.divisionId === divisionId
  );
  const numOfFields = calculateDivisionFieldsNumber(
    divisionId,
    schedulerResult
  );
  const tournamentTime = calculateDivisionTournamentTime(
    divisionId,
    schedulerResult
  );
  const minTournamentTime = getTournamentTimeBy(
    divisionId,
    schedulerResult,
    'min'
  );
  const maxTournamentTime = getTournamentTimeBy(
    divisionId,
    schedulerResult,
    'max'
  );
  const facilityId = keys(facilityData).find(key =>
    facilityData[key]?.divisionIds?.includes(divisionId)
  );
  const facility = find(facilities, ['id', facilityId])?.name;

  return [
    divisionId,
    divisionName,
    numOfTeams,
    numOfGames.length,
    numOfFields,
    tournamentTime,
    minTournamentTime,
    maxTournamentTime,
    facility,
  ];
};

const formatDivisionsDiagnostics = (schedulerResult: Scheduler) => {
  const { teamCards } = schedulerResult;

  const allDivisionsArr = teamCards.map(teamCard => teamCard.divisionId);
  const allDivisions = union(allDivisionsArr);

  const divisionsArr = allDivisions.map(divisionId =>
    calculateDivisionDiagnostics(divisionId, schedulerResult)
  );

  const header = [
    'Division ID',
    'Division Name',
    '# of Teams',
    '# of Games',
    '# of Fields',
    'Avg. Time / Team',
    'Min. Time / Team',
    'Max. Time / Team',
    'Facility Name',
  ];

  return {
    header,
    body: divisionsArr,
  };
};

export default formatDivisionsDiagnostics;
