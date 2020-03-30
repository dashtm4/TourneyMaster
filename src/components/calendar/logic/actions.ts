import { Dispatch, ActionCreator } from 'redux';
import { ICalendarEvent } from 'common/models/calendar';
import { Toasts } from 'components/common';

import {
  CALENDAR_EVENT_FETCH_MULT,
  CALENDAR_EVENT_CREATE_SUCC,
  GET_TAGS_SUCCESS,
} from './actionTypes';
import { isCalendarEventValid } from './helper';
import api from 'api/api';
import { ThunkAction } from 'redux-thunk';

/**
 * Fake api calls
 */
const post = async (_url: string, _data: any): Promise<any> =>
  await new Promise((res: any) => setTimeout(() => res(200), 1000));

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

const getTagsSuccess = (payload: any[]) => ({
  type: GET_TAGS_SUCCESS,
  payload,
});

export const getCalendarEvents = () => async (dispatch: Dispatch) => {
  const response = await api.get('/calendar_events');

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

export const saveCalendarEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (event: ICalendarEvent) => async (_dispatch: Dispatch) => {
  const response = await api.post('/calendar_events', event);

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't create");
  }

  Toasts.successToast('Successfully created');
};

export const updateCalendarEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (event: ICalendarEvent) => async (_dispatch: Dispatch) => {
  const response = await api.put(
    `/calendar_events?cal_event_id=${event.cal_event_id}`,
    event
  );

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't update");
  }

  Toasts.successToast('Successfully updated');
};

export const deleteCalendarEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (id: string) => async (_dispatch: Dispatch) => {
  const response = await api.delete(`/calendar_events?cal_event_id=${id}`);

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't delete");
  }

  Toasts.successToast('Successfully deleted');
};

export const getTags = (value: string) => async (dispatch: Dispatch) => {
  if (value) {
    const response = await api.get(`/tag_search?search_term=${value}%25`);

    if (response && !response.error) {
      return dispatch(getTagsSuccess(response));
    }
  }
};
