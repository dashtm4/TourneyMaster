import {
  REGISTRATION_FETCH_SUCCESS,
  REGISTRATION_FETCH_FAILURE,
  REGISTRATION_UPDATE_SUCCESS,
  REGISTRATION_FETCH_START,
  DIVISIONS_FETCH_SUCCESS,
  REGISTRANTS_FETCH_SUCCESS,
  REGISTRANTS_PAYMENTS_FETCH_SUCCESS,
  EVENT_FETCH_SUCCESS,
} from './actionTypes';
import api from 'api/api';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Toasts } from 'components/common';
import { getVarcharEight } from 'helpers';
import { IRegistration } from 'common/models/registration';
import { ICalendarEvent } from 'common/models/calendar';
import { IDivision } from 'common/models';

export const registrationFetchStart = (): { type: string } => ({
  type: REGISTRATION_FETCH_START,
});

export const registrationFetchSuccess = (
  payload: any
): { type: string; payload: any } => ({
  type: REGISTRATION_FETCH_SUCCESS,
  payload,
});

export const registrationFetchFailure = (): { type: string } => ({
  type: REGISTRATION_FETCH_FAILURE,
});

export const registrationUpdateSuccess = (
  payload: any
): { type: string; payload: any } => ({
  type: REGISTRATION_UPDATE_SUCCESS,
  payload,
});

export const getRegistration: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (eventId: string) => async (dispatch: Dispatch) => {
  dispatch(registrationFetchStart());
  const data = await api.get(`/registrations?event_id=${eventId}`);
  if (data && data.length > 0) {
    dispatch<any>(getRegistrants(data[0].registration_id));
  }
  const event = await api.get(`/events?event_id=${eventId}`);
  dispatch(registrationFetchSuccess(data));
  dispatch({
    type: EVENT_FETCH_SUCCESS,
    payload: event,
  });
};

export const saveRegistration: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (registration: IRegistration, eventId: string) => async (
  dispatch: Dispatch
) => {
  const calendarEvent: Partial<ICalendarEvent> = {
    cal_event_id: registration.registration_id || '',
    cal_event_title: 'Registration',
    cal_event_type: 'event',
    cal_event_startdate: registration.registration_start || '',
    cal_event_enddate: registration.registration_end || '',
    has_reminder_YN: 1,
    status_id: 1,
  };

  if (registration?.registration_id) {
    dispatch(registrationFetchStart());
    const response = await api.put(
      `/registrations?registration_id=${registration.registration_id}`,
      registration
    );

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't update a registration");
    }
    dispatch(registrationUpdateSuccess(registration));
    dispatch<any>(saveCalendarEvent(calendarEvent));

    Toasts.successToast('Registration is successfully updated');
    dispatch<any>(getRegistrants(registration.registration_id));
  } else {
    const data = {
      ...registration,
      event_id: eventId,
      registration_id: getVarcharEight(),
    };
    calendarEvent.cal_event_id = data.registration_id;

    dispatch(registrationFetchStart());
    const response = await api.post(`/registrations`, data);

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't save a registration");
    }
    dispatch(registrationUpdateSuccess(data));
    dispatch<any>(saveCalendarEvent(calendarEvent));

    Toasts.successToast('Registration is successfully saved');
  }
};

export const saveCalendarEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (event: ICalendarEvent) => async () => {
  const eventList = await api.get(
    `/calendar_events?cal_event_id=${event.cal_event_id}`
  );

  if (eventList.length) {
    // update if exist
    const response = await api.put(
      `/calendar_events?cal_event_id=${event.cal_event_id}`,
      event
    );

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't update (calendar event)");
    }
  } else {
    // create if not exist
    const response = await api.post('/calendar_events', event);

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't create (calendar event)");
    }
  }

  Toasts.successToast('Successfully saved (calendar event)');
};

export const getDivisions: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (eventId: string) => async (dispatch: Dispatch) => {
  const data = await api.get(`/divisions?event_id=${eventId}`);
  dispatch(divisionsFetchSuccess(data));
};

export const divisionsFetchSuccess = (
  payload: IDivision
): { type: string; payload: IDivision } => ({
  type: DIVISIONS_FETCH_SUCCESS,
  payload,
});

export const getRegistrants: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (registrationId: string) => async (dispatch: Dispatch) => {
  const [teams, individuals] = await Promise.all([
    api.get(`/reg_responses_teams?registration_id=${registrationId}`),
    api.get(`/reg_responses_individuals?registration_id=${registrationId}`),
  ]); // TODO

  const data = teams.concat(individuals);

  dispatch(registrantsFetchSuccess(data));
};

export const registrantsFetchSuccess = (
  payload: any[]
): { type: string; payload: any[] } => ({
  type: REGISTRANTS_FETCH_SUCCESS,
  payload,
});

export const getRegistrantPayments: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (regResponseId: string) => async (dispatch: Dispatch) => {
  dispatch(registrantsPaymentsFetchSuccess([]));
  const data = await api.get(
    `/registrations_payments?reg_response_id=${regResponseId}`
  ); // TODO

  dispatch(registrantsPaymentsFetchSuccess(data));
};

export const registrantsPaymentsFetchSuccess = (
  payload: any[]
): { type: string; payload: any[] } => ({
  type: REGISTRANTS_PAYMENTS_FETCH_SUCCESS,
  payload,
});
