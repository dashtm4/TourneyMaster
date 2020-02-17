import { ButtonTypeEvent } from 'components/calendar/calendar.helper';

export interface IEvent {
  title: string;
  start: string;
  end: string;
  className?: string;
}

export interface ICalendarEvent {
  title: string;
  dateFrom: string;
  dateTo: string;
  location: string;
  eventTag: string;

  type: ButtonTypeEvent;
  timeFrom: string;
  timeTo: string;
  description: string;
  setReminder: boolean;
}
