import { find } from 'lodash-es';
import { updateGameSlot } from 'components/playoffs/helper';
import {
  settleTeamsPerGames,
  IGame,
} from 'components/common/matrix-table/helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { DefaultSelectValues } from 'common/enums';
import { IBracketGame } from 'components/playoffs/bracketGames';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IDivision } from 'common/models';
import { populateDefinedGamesWithPlayoffState } from 'components/schedules/definePlayoffs';

const getAllTeamCardGames = (
  teamCards: ITeamCard[],
  games: IGame[],
  eventDays: string[],
  bracketGames?: IBracketGame[],
  playoffTimeSlots?: ITimeSlot[],
  divisions?: IDivision[]
) => {
  const allGamesByTeamCards = eventDays
    .map((_, idx) => {
      let definedGames = [...games];
      const day = `${idx + 1}`;

      if (+day === eventDays.length && playoffTimeSlots) {
        definedGames = populateDefinedGamesWithPlayoffState(
          games,
          playoffTimeSlots
        );

        definedGames = definedGames.map(item => {
          const foundBracketGame = find(bracketGames, {
            fieldId: item.fieldId,
            startTime: item.startTime,
          });

          return foundBracketGame
            ? updateGameSlot(item, foundBracketGame, divisions)
            : item;
        });
      }

      const filledGames = settleTeamsPerGames(
        definedGames,
        teamCards,
        eventDays,
        day
      );

      return filledGames;
    })
    .flat();

  return allGamesByTeamCards;
};

const getGamesByDays = (games: IGame[], activeDay: string[]) => {
  const gamesByDays = games.filter(
    it =>
      activeDay.includes(it.gameDate!) ||
      activeDay.includes(DefaultSelectValues.ALL)
  );

  return gamesByDays;
};

export { getAllTeamCardGames, getGamesByDays };
