import {
  settleTeamsPerGames,
  calculateDays,
  IGame,
} from 'components/common/matrix-table/helper';
import { ITeamCard } from 'common/models/schedule/teams';

const getAllGamesByTeamCards = (teamCards: ITeamCard[], games: IGame[]) => {
  const eventDays = calculateDays(teamCards);

  const allGamesByTeamCards = eventDays
    .map((_, idx) =>
      settleTeamsPerGames(games, teamCards, eventDays, `Day ${idx + 1}`)
    )
    .flat();

  return allGamesByTeamCards;
};

export { getAllGamesByTeamCards };
