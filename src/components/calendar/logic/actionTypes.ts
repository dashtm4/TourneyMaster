import { ICalendarEvent } from 'common/models/calendar';
import ITag from 'common/models/calendar/tag';

export const CALENDAR_EVENT_CREATE_SUCC = 'CALENDAR_EVENT_CREATE_SUCC';
export const CALENDAR_EVENT_CREATE_FAIL = 'CALENDAR_EVENT_CREATE_FAIL';

export const CALENDAR_EVENT_FETCH_MULT = 'CALENDAR_EVENT_FETCH_MULT';
export const CALENDAR_EVENT_FETCH_SING = 'CALENDAR_EVENT_FETCH_SING';

export const GET_TAGS_SUCCESS = 'CALENDAR_EVENT_GET_TAGS_SUCCESS';

export interface CalendarEventFetchMult {
  type: 'CALENDAR_EVENT_FETCH_MULT';
  payload: ICalendarEvent[];
}

export interface CalendarEventCreateSucc {
  type: 'CALENDAR_EVENT_CREATE_SUCC';
}

export interface GetTagsSuccess {
  type: 'CALENDAR_EVENT_GET_TAGS_SUCCESS';
  payload: ITag[];
}

export type CalendarEventActions =
  | CalendarEventFetchMult
  | CalendarEventCreateSucc
  | GetTagsSuccess;
