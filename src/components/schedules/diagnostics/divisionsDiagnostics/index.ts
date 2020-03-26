import { union, filter, find, orderBy, findIndex, flatten } from 'lodash-es';
import { calculateTeamTournamentTime } from '../teamsDiagnostics';
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

const calculateDivisionDiagnostics = (
  divisionId: string,
  diagnosticsProps: IDivisionsDiagnosticsProps
) => {
  const { divisions, facilities, games, teamCards } = diagnosticsProps;

  const divisionName = find(divisions, ['id', divisionId])?.name;
  const numOfTeams = filter(teamCards, ['divisionId', divisionId])?.length;
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
  const facilityId = divisionGame?.facilityId;
  const facility = find(facilities, ['id', facilityId])?.name;

  return [
    divisionId,
    divisionName,
    numOfTeams,
    numOfGames,
    numOfFields,
    tournamentTime,
    minTournamentTime,
    maxTournamentTime,
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
