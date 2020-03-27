import { find, orderBy, union, findIndex } from 'lodash-es';
import { ITeamCard } from 'common/models/schedule/teams';
import { getTimeFromString, timeToString } from 'helpers';
import { IGame } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import { IScheduleDivision } from 'common/models/schedule/divisions';

export interface ITeamsDiagnosticsProps {
  teamCards: ITeamCard[];
  fields: IField[];
  games: IGame[];
  divisions: IScheduleDivision[];
  totalGameTime: number;
}

export const calculateTeamTournamentTime = (
  teamCard: ITeamCard,
  games: IGame[],
  totalGameTime: number
) => {
  const teamGames = games.filter(
    game => findIndex(teamCard.games, { id: game.id }) >= 0
  );
  const teamGameTimes = teamGames
    .map(game => game.startTime)
    .map(startTime =>
      startTime ? getTimeFromString(startTime, 'minutes') : 0
    );

  let lastGameTime = 0;
  let firstGameTime = 0;

  if (teamGameTimes.length > 1) {
    lastGameTime = teamGameTimes[teamGameTimes.length - 1] + totalGameTime;
    firstGameTime = teamGameTimes[0];
  }

  return timeToString(lastGameTime - firstGameTime);
};

const calculateBackToBacks = (teamCard: ITeamCard, games: IGame[]) => {
  const teamGames = games.filter(
    game => findIndex(teamCard.games, { id: game.id }) >= 0
  );
  const timeSlots = teamGames.map(game => game.timeSlotId);
  const timeSlotsSorted = orderBy(timeSlots, [], 'asc');
  const backToBacks: number[] = [];

  timeSlotsSorted.map((ts, index, arr) =>
    arr[index] === arr[index - 1] || arr[index] - arr[index - 1] === 1
      ? backToBacks.push(arr[index - 1], ts)
      : null
  );

  const backToBackUnique = union(backToBacks);
  return backToBackUnique.length;
};

const calculateTeamDiagnostics = (
  teamCard: ITeamCard,
  diagnosticsProps: ITeamsDiagnosticsProps
) => {
  const { fields, games, divisions, totalGameTime } = diagnosticsProps;

  const id = teamCard.id;
  const name = teamCard.name;
  const divisionName = find(divisions, ['id', teamCard.divisionId])?.name;
  const numOfGames = teamCard.games?.length || 0;
  const teamGames = games.filter(
    game => findIndex(teamCard.games, { id: game.id }) >= 0
  );

  const tournamentTime = calculateTeamTournamentTime(
    teamCard,
    games,
    totalGameTime
  );

  const numOfBackToBacks = calculateBackToBacks(teamCard, games);
  const fieldIds = teamGames.map(game => game.fieldId);
  const fieldNames = fields
    .filter(field => fieldIds.includes(field.id))
    .map(field => field.name);

  const numOfFields: string = fieldNames?.length ? fieldNames.join(', ') : '-';

  return [
    id,
    name,
    divisionName,
    numOfGames,
    tournamentTime,
    numOfBackToBacks,
    numOfFields,
  ];
};

const formatTeamsDiagnostics = (diagnosticsProps: ITeamsDiagnosticsProps) => {
  const { teamCards } = diagnosticsProps;
  const teamsArr = teamCards.map(teamCard =>
    calculateTeamDiagnostics(teamCard, diagnosticsProps)
  );
  const header = [
    'Team ID',
    'Team Name',
    'Division Name',
    '# of Games',
    'Tournament Time',
    '# of Back-to-Back games',
    'Field Name(s)',
  ];

  return {
    header,
    body: teamsArr,
  };
};

export default formatTeamsDiagnostics;
