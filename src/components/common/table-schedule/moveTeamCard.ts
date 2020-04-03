import { findIndex, find } from 'lodash-es';
import { ITeamCard } from 'common/models/schedule/teams';
import { IDropParams } from '../matrix-table/dnd/drop';
import { TeamPositionEnum } from '../matrix-table/helper';

export default (
  teamCards: ITeamCard[],
  dropParams: IDropParams,
  day?: string
) => {
  const { teamId, position, gameId, originGameId } = dropParams;
  let result = {
    teamCards: [...teamCards],
    divisionUnmatch: false,
    poolUnmatch: false,
  };

  const newTeamCards = [...teamCards].map(teamCard => {
    const incomingTeam = find(teamCards, { id: teamId });
    const outcomingTeam = find(
      teamCards,
      ({ games }) =>
        findIndex(games, {
          id: gameId,
          teamPosition:
            position === TeamPositionEnum.awayTeam
              ? TeamPositionEnum.homeTeam
              : TeamPositionEnum.awayTeam,
        }) >= 0
    );

    /* Compare division ids between replacing teams */
    if (
      incomingTeam !== undefined &&
      outcomingTeam !== undefined &&
      incomingTeam?.divisionId !== outcomingTeam?.divisionId
    ) {
      result = {
        ...result,
        divisionUnmatch: true,
      };
    }

    /* Compare pool ids between replacing teams */
    if (
      incomingTeam !== undefined &&
      outcomingTeam !== undefined &&
      incomingTeam?.poolId !== outcomingTeam?.poolId
    ) {
      result = {
        ...result,
        poolUnmatch: true,
      };
    }

    /* Find and update replacing teams */
    if (teamCard.id === teamId) {
      let games = [
        ...(teamCard.games?.filter(game => game.id !== originGameId) || []),
      ];

      if (gameId !== undefined && position !== undefined) {
        games = [...games, { id: gameId, teamPosition: position, date: day }];
      }
      console.log('games 1', games);
      return {
        ...teamCard,
        games,
      };
    }

    if (
      findIndex(teamCard.games, { id: gameId, teamPosition: position }) >= 0
    ) {
      console.log('games 2', [
        ...teamCard.games?.filter(game => game.id !== gameId),
      ]);
      return {
        ...teamCard,
        games: [...teamCard.games?.filter(game => game.id !== gameId)],
      };
    }

    return teamCard;
  });

  result = {
    ...result,
    teamCards: [...newTeamCards],
  };

  return result;
};
