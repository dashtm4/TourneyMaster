import { Dispatch } from 'redux';
import { ICalendarEvent } from 'common/models/calendar';
import { Toasts } from 'components/common';

import { CALENDAR_EVENT_FETCH_MULT } from './actionTypes';
import { isCalendarEventValid } from './helper';

const eventsList = [
  {
    title: 'Event Number One',
    start: '2020-02-01T10:00:00',
    end: '2020-02-05T12:00:00',
    className: 'event',
  },
  {
    title: 'Reminder Number One',
    start: '2020-02-07T18:35:00',
    end: '2020-02-07T20:10:00',
    className: 'reminder',
  },
  {
    title: 'Task Number One',
    start: '2020-02-10T11:00:00',
    end: '2020-02-12T23:10:00',
    className: 'task',
  },
];
/**
 * Fake api calls
 */
const post = async (_url: string, _data: any): Promise<any> =>
  await new Promise((res: any) => setTimeout(() => res(200), 1000));

const get = async (_url: string): Promise<any> =>
  await new Promise((res: any) => setTimeout(() => res(eventsList), 1000));

/*
 * Actions
 */
const fetchCalendarEvents = (payload: ICalendarEvent[]) => ({
  type: CALENDAR_EVENT_FETCH_MULT,
  payload,
});

export const getCalendarEvents = () => async (dispatch: Dispatch) => {
  const response = await get('/calendarEvents');

  if (response && !response.error) {
    return dispatch(fetchCalendarEvents(response));
  }

  Toasts.errorToast("Couldn't load the events");
};

export const createCalendarEvent = (data: ICalendarEvent) => async () => {
  const isEventValid = isCalendarEventValid(data);
  if (!isEventValid) return Toasts.errorToast('Event data is invalid');

  const response = await post('/calendarEvents', data);

  if (response && !response.error) {
    return Toasts.successToast('Calendar event created successfully');
  }

  Toasts.errorToast("Couldn't create event");
};
