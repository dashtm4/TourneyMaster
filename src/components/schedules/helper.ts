import { getTimeFromString, timeToString } from 'helpers/stringTimeOperations';
import { EventDetailsDTO } from 'components/event-details/logic/model';

interface ITimeValues {
  firstGameTime: string;
  lastGameEnd: string;
  preGameWarmup: string | null;
  periodDuration: string;
  timeBtwnPeriods: string;
  periodsPerGame: number;
}

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

export const setGameOptions = (event: EventDetailsDTO) => {
  const {
    min_num_of_games,
    pre_game_warmup,
    period_duration,
    time_btwn_periods,
    periods_per_game,
  } = event;
  return {
    minGameNum: min_num_of_games,
    maxGameNum: min_num_of_games,
    totalGameTime: calculateTotalGameTime(
      pre_game_warmup,
      period_duration,
      time_btwn_periods,
      periods_per_game
    ),
  };
};

export const getTimeValuesFromEvent = (
  event: EventDetailsDTO
): ITimeValues => ({
  firstGameTime: event.first_game_time,
  lastGameEnd: event.last_game_end,
  preGameWarmup: event.pre_game_warmup,
  periodDuration: event.period_duration,
  timeBtwnPeriods: event.time_btwn_periods,
  periodsPerGame: event.periods_per_game,
});

export const calculateTimeSlots = (timeValues: ITimeValues) => {
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
