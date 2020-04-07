import { ITeamCard } from 'common/models/schedule/teams';
import { IDropParams } from '../matrix-table/dnd/drop';
import { findIndex, find } from 'lodash-es';

export default (
  teamCards: ITeamCard[],
  dropParams: IDropParams,
  day?: string
) => {
  const { teamId, position, gameId, originGameId, originGameDate } = dropParams;
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
          teamPosition: position,
          date: day,
        }) >= 0
    );

    if (
      incomingTeam !== undefined &&
      outcomingTeam !== undefined &&
      incomingTeam.divisionId !== outcomingTeam.divisionId
    ) {
      result = {
        ...result,
        divisionUnmatch: true,
      };
    }

    if (
      incomingTeam !== undefined &&
      outcomingTeam !== undefined &&
      incomingTeam.poolId !== outcomingTeam.poolId
    ) {
      result = {
        ...result,
        poolUnmatch: true,
      };
    }

    /* 1. Handle dropping inside the table */

    if (gameId && position && teamId === teamCard.id) {
      let games = [
        ...teamCard.games?.filter(
          item => item.id !== originGameId || item.date !== originGameDate
        ),
        {
          id: gameId,
          teamPosition: position,
          isTeamLocked: false,
          date: day,
        },
      ];

      if (
        findIndex(teamCard.games, {
          id: gameId,
          teamPosition: position === 1 ? 2 : 1,
          date: day,
        }) >= 0
      ) {
        games = [
          ...games.filter(
            item =>
              item.id !== gameId ||
              item.teamPosition !== (position === 1 ? 2 : 1) ||
              item.date !== day
          ),
        ];
      }

      return {
        ...teamCard,
        games,
      };
    }

    /* 2. Handle dropping into the Unassigned table */

    if (!gameId && !position && teamId === teamCard.id) {
      const games = [
        ...teamCard.games?.filter(
          item => item.id !== originGameId || item.date !== originGameDate
        ),
      ];
      return {
        ...teamCard,
        games,
      };
    }

    /* 3. Remove replaced team game */

    if (
      findIndex(teamCard.games, {
        id: gameId,
        teamPosition: position,
        date: day,
      }) >= 0
    ) {
      const games = [
        ...teamCard.games?.filter(
          item =>
            item.id !== gameId ||
            item.teamPosition !== position ||
            item.date !== day
        ),
      ];
      return {
        ...teamCard,
        games,
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
