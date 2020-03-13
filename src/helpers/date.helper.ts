import moment from 'moment';

const timeToDate = (time: string) =>
  moment(time.split(':').join(''), 'HHmmss').format();

const dateToTime = (date: Date | string) => moment(date).format('HH:mm:ss');

const getTimeFromString = (
  time: string,
  type: 'hours' | 'minutes' | 'seconds'
): number => {
  if (!time) {
    return 0;
  }
  const divides = time.split(':').map((timeDiv: string) => Number(timeDiv));
  const [hours, minutes, seconds] = divides;

  switch (type) {
    case 'hours':
      return hours;
    case 'minutes':
      return hours * 60 + minutes;
    case 'seconds':
      return hours * 3600 + minutes * 60 + seconds;
    default:
      return -1;
  }
};

const timeToString = (time: number): string => {
  const hours = Math.floor(time / 60);
  const minutes = time - hours * 60;
  const seconds = time * 60 - hours * 3600 - minutes * 60;

  return [hours, minutes, seconds]
    .toString()
    .split(',')
    .map((el: string) => (el.length < 2 ? '0' + el : el))
    .join(':');
};

export { timeToDate, dateToTime, getTimeFromString, timeToString };
