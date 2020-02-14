import { IEvent } from 'common/models/calendar';

export const CALENDAR_EVENT_CREATE_SUCC = 'CALENDAR_EVENT_CREATE_SUCC';
export const CALENDAR_EVENT_CREATE_FAIL = 'CALENDAR_EVENT_CREATE_FAIL';

export const CALENDAR_EVENT_FETCH_MULT = 'CALENDAR_EVENT_FETCH_MULT';
export const CALENDAR_EVENT_FETCH_SING = 'CALENDAR_EVENT_FETCH_SING';

export interface CalendarEventFetchMult {
  type: 'CALENDAR_EVENT_FETCH_MULT';
  payload: IEvent[];
}

export type CalendarEventActions = CalendarEventFetchMult;
