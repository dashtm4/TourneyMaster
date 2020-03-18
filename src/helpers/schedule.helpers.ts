import { getTimeFromString, timeToString } from 'helpers';
import { IEventDetails } from 'common/models';
import moment from 'moment';

interface ITimeValues {
  firstGameTime: string;
  lastGameEnd: string;
  preGameWarmup: string | null;
  periodDuration: string;
  timeBtwnPeriods: string;
  periodsPerGame: number;
}

const setGameOptions = (event: IEventDetails) => {
  const {
    min_num_of_games,
    pre_game_warmup,
    period_duration,
    time_btwn_periods,
    periods_per_game,
  } = event;
  return {
    minGameNum: min_num_of_games || undefined,
    maxGameNum: min_num_of_games || undefined,
    totalGameTime: calculateTotalGameTime(
      pre_game_warmup,
      period_duration!,
      time_btwn_periods!,
      periods_per_game!
    ),
  };
};

const calculateTotalGameTime = (
  preGameWarmup: string | null,
  periodDuration: string,
  timeBtwnPeriods: string,
  periodsPerGame: number
) => {
  const preGameWarmupMin = getTimeFromString(preGameWarmup!, 'minutes');
  const periodDurationMin = getTimeFromString(periodDuration, 'minutes');
  const timeBtwnPeriodsMin = getTimeFromString(timeBtwnPeriods, 'minutes');
  return (
    preGameWarmupMin + periodDurationMin * periodsPerGame + timeBtwnPeriodsMin
  );
};

const getTimeValuesFromEvent = (event: IEventDetails): ITimeValues => ({
  firstGameTime: event.first_game_time,
  lastGameEnd: event.last_game_end,
  preGameWarmup: event.pre_game_warmup,
  periodDuration: event.period_duration,
  timeBtwnPeriods: event.time_btwn_periods,
  periodsPerGame: event.periods_per_game,
});

const calculateTimeSlots = (timeValues: ITimeValues) => {
  if (!timeValues) return;

  const {
    firstGameTime,
    lastGameEnd,
    preGameWarmup,
    periodDuration,
    timeBtwnPeriods,
    periodsPerGame,
  } = timeValues;

  const firstGameTimeMin = getTimeFromString(firstGameTime, 'minutes');
  const lastGameEndMin = getTimeFromString(lastGameEnd, 'minutes');
  const totalGameTime = calculateTotalGameTime(
    preGameWarmup,
    periodDuration,
    timeBtwnPeriods,
    periodsPerGame
  );
  const timeSlots = [];

  const timeSlotsNum = Math.floor(
    (lastGameEndMin - firstGameTimeMin) / totalGameTime
  );

  for (let i = 0; i < timeSlotsNum; i++) {
    const timeInMin = firstGameTimeMin + totalGameTime * i;

    const validMinutes = 5 * Math.ceil(timeInMin / 5);
    const timeInStringFormat = timeToString(validMinutes);

    timeSlots.push({
      id: i,
      time: timeInStringFormat,
    });
  }

  return timeSlots;
};

const formatTimeSlot = (time: string) => {
  if (!time || typeof time !== 'string') return;
  const timeValue = time.slice(0, 5);
  return moment(timeValue, ['HH:mm']).format('hh:mm A');
};

export {
  setGameOptions,
  calculateTotalGameTime,
  getTimeValuesFromEvent,
  calculateTimeSlots,
  formatTimeSlot,
};
