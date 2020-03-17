import { find } from 'lodash-es';
import Scheduler from 'components/schedules/Scheduler';
import { ITeamCard } from 'common/models/schedule/teams';
import { getTimeFromString, timeToString } from 'helpers';
import { IGame } from 'components/common/matrix-table/helper';

export const calculateTeamTournamentTime = (
  teamCard: ITeamCard,
  games: IGame[],
  totalGameTime: number
) => {
  const teamGames = games.filter(game => teamCard.games?.includes(game.id));
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

const calculateTeamDiagnostics = (
  teamCard: ITeamCard,
  schedulerResult: Scheduler
) => {
  const { fields, updatedGames, divisions, totalGameTime } = schedulerResult;

  const id = teamCard.id;
  const name = teamCard.name;
  const divisionName = find(divisions, ['id', teamCard.divisionId])?.name;
  const numOfGames = teamCard.games?.length || 0;
  const teamGames = updatedGames.filter(game =>
    teamCard.games?.includes(game.id)
  );

  const tournamentTime = calculateTeamTournamentTime(
    teamCard,
    updatedGames,
    totalGameTime
  );

  const numOfBackToBacks = 0;
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

const formatTeamsDiagnostics = (schedulerResult: Scheduler) => {
  const { teamCards } = schedulerResult;
  const teamsArr = teamCards.map(teamCard =>
    calculateTeamDiagnostics(teamCard, schedulerResult)
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
