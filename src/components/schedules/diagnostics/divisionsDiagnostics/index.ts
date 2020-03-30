import { union, filter, find, orderBy, findIndex, flatten } from 'lodash-es';
import {
  calculateTeamTournamentTime,
  calculateNumOfTimeSlots,
} from '../teamsDiagnostics';
import { getTimeFromString, timeToString } from 'helpers';
import { ITeamCard } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import { IGame } from 'components/common/matrix-table/helper';
import { IScheduleDivision } from 'common/models/schedule/divisions';
import { IScheduleFacility } from 'common/models/schedule/facilities';

export interface IDivisionsDiagnosticsProps {
  teamCards: ITeamCard[];
  fields: IField[];
  games: IGame[];
  facilities: IScheduleFacility[];
  divisions: IScheduleDivision[];
  totalGameTime: number;
}

const calculateDivisionFieldsNumber = (
  divisionId: string,
  diagnosticsProps: IDivisionsDiagnosticsProps
) => {
  const { teamCards, games } = diagnosticsProps;
  const divisionTeams = filter(teamCards, { divisionId });
  const divisionGames = divisionTeams
    .map(item => item.games)
    .flat()
    .map(item => item.id);
  const uniqueGameIds = union(divisionGames);
  const fieldIds = games
    .filter(game => uniqueGameIds.includes(game.id))
    .map(game => game.fieldId);
  const uniqueFieldIds = union(fieldIds);
  return uniqueFieldIds.length;
};

const calculateDivisionTournamentTime = (
  divisionId: string,
  diagnosticsProps: IDivisionsDiagnosticsProps
) => {
  const { teamCards, games, totalGameTime } = diagnosticsProps;

  const teams = filter(teamCards, ['divisionId', divisionId]);
  const teamsTournamentTime = teams.map(team =>
    calculateTeamTournamentTime(team, games, totalGameTime)
  );
  const tournamentTimeTotal = teamsTournamentTime
    .map(time => getTimeFromString(time, 'minutes'))
    .reduce((a, b) => a + b);
  const avgTournamentTime = Math.round(tournamentTimeTotal / teams.length);

  return timeToString(avgTournamentTime);
};

const getTournamentTimeBy = (
  divisionId: string,
  diagnosticsProps: IDivisionsDiagnosticsProps,
  orderedBy: 'min' | 'max'
) => {
  const { teamCards, games, totalGameTime } = diagnosticsProps;
  const teams = filter(teamCards, ['divisionId', divisionId]);
  const teamsTournamentTime = teams.map(team =>
    calculateTeamTournamentTime(team, games, totalGameTime)
  );
  switch (orderedBy) {
    case 'max':
      return orderBy(teamsTournamentTime, [], 'desc')[0];
    default:
      return orderBy(teamsTournamentTime, [], 'asc')[0];
  }
};

const calculateTimeSlotsBetweenGames = (
  teamCards: ITeamCard[],
  games: IGame[]
) => {
  const timeSlotsNum = teamCards.map(item =>
    calculateNumOfTimeSlots(item, games)
  );

  const timeSlotsIn0 = timeSlotsNum.filter(v => v === 0).length;
  const timeSlotsIn1 = timeSlotsNum.filter(v => v === 1).length;
  const timeSlotsIn2 = timeSlotsNum.filter(v => v === 2).length;
  const timeSlotsIn3 = timeSlotsNum.filter(v => v === 3).length;
  const timeSlotsIn4 = timeSlotsNum.filter(v => v === 4).length;

  return {
    timeSlotsIn0,
    timeSlotsIn1,
    timeSlotsIn2,
    timeSlotsIn3,
    timeSlotsIn4,
  };
};

const calculateDivisionDiagnostics = (
  divisionId: string,
  diagnosticsProps: IDivisionsDiagnosticsProps
) => {
  const { divisions, facilities, games, teamCards } = diagnosticsProps;

  const divisionName = find(divisions, { id: divisionId })?.name;
  const divisionTeams = filter(teamCards, { divisionId });
  const numOfTeams = divisionTeams?.length;
  const allDivisionGames = teamCards
    .filter(
      teamCard => teamCard.divisionId === divisionId && teamCard.games?.length
    )
    .map(teamCard => teamCard.games)
    .flat()
    .map(game => game.id);
  const numOfGames = union(allDivisionGames).length;

  const numOfFields = calculateDivisionFieldsNumber(
    divisionId,
    diagnosticsProps
  );
  const tournamentTime = calculateDivisionTournamentTime(
    divisionId,
    diagnosticsProps
  );
  const minTournamentTime = getTournamentTimeBy(
    divisionId,
    diagnosticsProps,
    'min'
  );
  const maxTournamentTime = getTournamentTimeBy(
    divisionId,
    diagnosticsProps,
    'max'
  );
  const divisionTeamCardGames = teamCards
    .filter(
      teamCard => teamCard.games?.length && teamCard.divisionId === divisionId
    )
    .map(teamCard => teamCard.games);
  const divisionGames = flatten(divisionTeamCardGames);
  const divisionGame = games.find(
    game => findIndex(divisionGames, { id: game.id }) >= 0
  );

  const timeSlotsBetweenGames = calculateTimeSlotsBetweenGames(
    divisionTeams,
    games
  );

  const {
    timeSlotsIn0,
    timeSlotsIn1,
    timeSlotsIn2,
    timeSlotsIn3,
    timeSlotsIn4,
  } = timeSlotsBetweenGames;

  const facilityId = divisionGame?.facilityId;
  const facility = find(facilities, ['id', facilityId])?.name;

  return [
    divisionName,
    numOfTeams,
    numOfGames,
    numOfFields,
    tournamentTime,
    minTournamentTime,
    maxTournamentTime,
    timeSlotsIn0,
    timeSlotsIn1,
    timeSlotsIn2,
    timeSlotsIn3,
    timeSlotsIn4,
    facility,
  ];
};

const formatDivisionsDiagnostics = (
  diagnosticsProps: IDivisionsDiagnosticsProps
) => {
  const { teamCards } = diagnosticsProps;

  const allDivisionsArr = teamCards.map(teamCard => teamCard.divisionId);
  const allDivisions = union(allDivisionsArr);

  const divisionsArr = allDivisions.map(divisionId =>
    calculateDivisionDiagnostics(divisionId, diagnosticsProps)
  );

  const header = [
    'Division Name',
    '# of Teams',
    '# of Games',
    '# of Fields',
    'Avg. Time / Team',
    'Min. Time / Team',
    'Max. Time / Team',
    '0 time slots between games',
    '1 time slots between games',
    '2 time slots between games',
    '3 time slots between games',
    '4 time slots between games',
    'Facility Name',
  ];

  return {
    header,
    body: divisionsArr,
  };
};

export default formatDivisionsDiagnostics;
