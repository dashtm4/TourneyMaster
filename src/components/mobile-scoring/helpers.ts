import {
  ISchedulesGameWithNames,
  ISelectOption,
  IEventDetails,
} from 'common/models';
import { orderBy } from 'lodash-es';
import moment from 'moment';

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

export { getDayOptions, getTabTimes, geEventDates, getEventOptions };
