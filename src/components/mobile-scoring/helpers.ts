import {
  ISchedulesGameWithNames,
  ISelectOption,
  IEventDetails,
  IFacility,
  IField,
} from 'common/models';
import { orderBy } from 'lodash-es';
import moment from 'moment';
import { IMobileScoringGame, ScoresRaioOptions } from './common';

const getGamesByScoreMode = (
  games: IMobileScoringGame[],
  scoreMode: ScoresRaioOptions
) => {
  let gamesByScoreMode;

  switch (scoreMode) {
    case ScoresRaioOptions.UNSCORED_GAMES:
      gamesByScoreMode = games.filter(
        it => !it.awayTeamScore && !it.homeTeamScore
      );

      break;

    case ScoresRaioOptions.ALL:
      return games;

    default:
      return games;
  }

  return gamesByScoreMode;
};

const getTeamWithFacility = (
  games: ISchedulesGameWithNames[],
  facilities: IFacility[],
  fields: IField[]
): IMobileScoringGame[] => {
  const teamWithFacility = games.map(game => {
    const currentField = fields.find(field => field.field_id === game.fieldId);

    const currentFacility = facilities.find(
      facility => facility.facilities_id === currentField?.facilities_id
    );

    return {
      ...game,
      facilityId: currentFacility?.facilities_id || null,
      facilityName: currentFacility?.facilities_description || null,
    };
  });

  return teamWithFacility;
};

const getEventOptions = (events: IEventDetails[]) => {
  const eventOptions = events.map(it => ({
    label: it.event_name,
    value: it.event_id,
  })) as ISelectOption[];

  const sortedEventOptions = orderBy(eventOptions, 'label', 'asc');

  return sortedEventOptions;
};

const geEventDates = (games: ISchedulesGameWithNames[]) => {
  const dates = Array.from(new Set(games.map(it => it.gameDate)));

  return dates;
};

const getDayOptions = (days: string[]): ISelectOption[] => {
  const dayOptions = days.map(day => ({
    label: moment(day).format('L'),
    value: day,
  }));

  return dayOptions;
};

const getTabTimes = (
  activeDay: string | null,
  games: ISchedulesGameWithNames[]
) => {
  if (!activeDay) {
    return [];
  }

  const timesByDay = games.reduce((acc, game) => {
    return game.gameDate === activeDay ? [...acc, game.startTime] : acc;
  }, [] as string[]);

  const uniqueGameTimes = Array.from(new Set(timesByDay));

  const sortedTimeSlots = orderBy(uniqueGameTimes, undefined, 'asc');

  return sortedTimeSlots;
};

export {
  getGamesByScoreMode,
  getDayOptions,
  getTabTimes,
  geEventDates,
  getEventOptions,
  getTeamWithFacility,
};
