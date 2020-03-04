import { ButtonTypeEvent } from 'components/calendar/calendar.helper';

export interface IEvent {
  title: string;
  start: string;
  end: string;
  className?: string;
}

export interface ICalendarEvent {
  // cal_event_id: string;
  // calendar_id: string;
  // cal_event_type: string;
  // cal_event_datetime: any;
  // cal_event_tag: string;
  // cal_event_desc: string;
  // is_active_YN: number;
  // created_by: string;
  // created_datetime: any;
  // updated_by: string;
  // updated_datetime: any;

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
