import { ISchedulesGame } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';
import { IBracketGame } from 'components/playoffs/bracketGames';
import { orderBy } from 'lodash-es';
import { formatTimeSlot } from 'helpers';

const mapGamesWithSchedulesGamesId = (
  games: IGame[],
  schedulesGames: ISchedulesGame[]
) => {
  const mappedGames = games?.map(game => ({
    ...game,
    varcharId: schedulesGames.find(
      schedulesGame =>
        game.fieldId === schedulesGame.field_id &&
        game.startTime === schedulesGame.start_time
    )?.game_id,
  }));

  return mappedGames;
};

const getSortedWarnGames = (games: IBracketGame[]) => {
  const sortedWarnGames = orderBy(
    games,
    ['index', 'divisionName'],
    ['asc', 'asc']
  );

  return sortedWarnGames;
};

const getGamesWartString = (message: string, games: IBracketGame[]) => {
  const gameWarnString = games.map(
    item =>
      `Game ${item.index} (${item.divisionName}) - ${
        item.fieldName
      }, ${formatTimeSlot(item.startTime!)}\n`
  );

  return message.concat(gameWarnString.join(''));
};

export { mapGamesWithSchedulesGamesId, getSortedWarnGames, getGamesWartString };
