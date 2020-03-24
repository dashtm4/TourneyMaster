import { findIndex } from 'lodash-es';
import { ITeamCard } from 'common/models/schedule/teams';
import { IDropParams } from '../matrix-table/dnd/drop';

export default (teamCards: ITeamCard[], dropParams: IDropParams) => {
  const { teamId, position, gameId, originGameId } = dropParams;

  const newTeamCards = [...teamCards].map(teamCard => {
    if (teamCard.id === teamId) {
      let games = [
        ...(teamCard.games?.filter(game => game.id !== originGameId) || []),
      ];

      if (gameId !== undefined && position !== undefined) {
        games = [...games, { id: gameId, teamPosition: position }];
      }

      return {
        ...teamCard,
        games,
      };
    }

    if (
      findIndex(teamCard.games, { id: gameId, teamPosition: position }) >= 0
    ) {
      return {
        ...teamCard,
        games: [...teamCard.games?.filter(game => game.id !== gameId)],
      };
    }

    return teamCard;
  });

  return newTeamCards;
};
