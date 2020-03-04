import { Dispatch } from 'redux';
import { ICalendarEvent } from 'common/models/calendar';
import { Toasts } from 'components/common';

import {
  CALENDAR_EVENT_FETCH_MULT,
  CALENDAR_EVENT_CREATE_SUCC,
} from './actionTypes';
import { isCalendarEventValid } from './helper';

const eventsList: ICalendarEvent[] = [
  {
    title: 'Event Number One',
    dateFrom: '2020-02-01T10:00:00',
    dateTo: '2020-02-05T12:00:00',
    location: 'Some Location',
    eventTag: 'Event tag',
    type: 'event',
    timeFrom: '2020-02-01T10:00:00',
    timeTo: '2020-02-05T12:00:00',
    description: 'Description',
    setReminder: false,
  },
  {
    title: 'Event Number 2',
    dateFrom: '2020-03-01T10:00:00',
    dateTo: '2020-03-01T12:00:00',
    location: 'Location',
    eventTag: 'tag',
    type: 'event',
    timeFrom: '2020-01-01T10:00:00',
    timeTo: '2020-01-02T12:00:00',
    description: 'Description',
    setReminder: false,
  },
  {
    title: 'Reminder Number One',
    dateFrom: '2020-02-07T18:35:00',
    dateTo: '2020-02-07T20:10:00',
    location: 'Some Location',
    eventTag: 'Event tag',
    type: 'reminder',
    timeFrom: '2020-02-07T18:35:00',
    timeTo: '2020-02-07T20:10:00',
    description: 'Description',
    setReminder: false,
  },
  {
    title: 'Task Number One',
    dateFrom: '2020-02-10T11:00:00',
    dateTo: '2020-02-12T23:10:00',
    location: 'Some Location',
    eventTag: 'Event tag',
    type: 'task',
    timeFrom: '2020-02-10T11:00:00',
    timeTo: '2020-02-12T23:10:00',
    description: 'Description',
    setReminder: false,
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

const calendarEventCreateSucc = () => ({
  type: CALENDAR_EVENT_CREATE_SUCC,
});

export const getCalendarEvents = () => async (dispatch: Dispatch) => {
  const response = await get('/calendar_events');

  if (response && !response.error) {
    return dispatch(fetchCalendarEvents(response));
  }

  Toasts.errorToast("Couldn't load the events");
};

export const saveCalendar = (data: ICalendarEvent[]) => async (
  dispatch: Dispatch
) => {
  const eventsAreValid = data.every((dataEl: ICalendarEvent) =>
    isCalendarEventValid(dataEl)
  );

  if (!eventsAreValid) return Toasts.errorToast('Event data is invalid');

  const response = await post('/calendar_events', data);

  if (response && !response.error) {
    dispatch(calendarEventCreateSucc());
    return Toasts.successToast('Calendar events saved successfully');
  }

  Toasts.errorToast("Couldn't save the data");
};
