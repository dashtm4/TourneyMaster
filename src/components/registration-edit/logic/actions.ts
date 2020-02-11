import {
  REGISTRATION_FETCH_SUCCESS,
  REGISTRATION_FETCH_FAILURE,
} from './actionTypes';
import api from 'api/api';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

export const registrationFetchSuccess = (
  payload: any
): { type: string; payload: any } => ({
  type: REGISTRATION_FETCH_SUCCESS,
  payload,
});

export const registrationFetchFailure = (): { type: string } => ({
  type: REGISTRATION_FETCH_FAILURE,
});

export const getRegistration: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const data = await api.get('/registrations');
  dispatch(registrationFetchSuccess(data));
};
