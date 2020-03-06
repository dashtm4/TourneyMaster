import { getTimeFromString, timeToString } from 'helpers/stringTimeOperations';

export const calculateTimeSlots = (
  firstGameTime: string,
  lastGameEnd: string,
  totalGameTime: number
) => {
  if (
    typeof firstGameTime !== 'string' ||
    typeof totalGameTime !== 'number' ||
    typeof lastGameEnd !== 'string' ||
    !firstGameTime ||
    !lastGameEnd ||
    !totalGameTime
  ) {
    return;
  }

  const firstGameTimeMin = getTimeFromString(firstGameTime, 'minutes');
  const lastGameEndMin = getTimeFromString(lastGameEnd, 'minutes');
  const timeSlots = [];

  const timeSlotsNum = Math.floor(
    (lastGameEndMin - firstGameTimeMin) / totalGameTime
  );

  for (let i = 0; i < timeSlotsNum; i++) {
    const timeInMin = firstGameTimeMin + totalGameTime * i;
    const timeInStringFormat = timeToString(timeInMin);
    timeSlots.push({
      id: i,
      time: timeInStringFormat,
    });
  }

  return timeSlots;
};
