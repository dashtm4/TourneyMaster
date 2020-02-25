import {
  REGISTRATION_FETCH_SUCCESS,
  REGISTRATION_FETCH_FAILURE,
  REGISTRATION_UPDATE_SUCCESS,
  REGISTRATION_FETCH_START,
} from './actionTypes';
import api from 'api/api';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Toasts } from 'components/common';
import { getVarcharEight } from 'helpers';
import { IRegistration } from 'common/models/registration';

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
  dispatch(registrationFetchSuccess(data));
};

export const saveRegistration: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (registration: IRegistration, eventId: string) => async (
  dispatch: Dispatch
) => {
  if (registration.registration_id) {
    dispatch(registrationFetchStart());
    const response = await api.put(
      `/registrations?registration_id=${registration.registration_id}`,
      registration
    );

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't update a registration");
    }
    dispatch(registrationUpdateSuccess(registration));
    Toasts.successToast('Registration is successfully updated');
  } else {
    const data = {
      ...registration,
      event_id: eventId,
      registration_id: getVarcharEight(),
    };
    dispatch(registrationFetchStart());
    const response = await api.post(`/registrations`, data);

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't save a registration");
    }
    dispatch(registrationUpdateSuccess(data));
    Toasts.successToast('Registration is successfully saved');
  }
};
