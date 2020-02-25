import {
  DIVISIONS_FETCH_SUCCESS,
  DIVISIONS_FETCH_FAILURE,
} from './actionTypes';
import api from 'api/api';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

export const divisionsFetchSuccess = (
  payload: any
): { type: string; payload: any } => ({
  type: DIVISIONS_FETCH_SUCCESS,
  payload,
});

export const divisionsFetchFailure = (): { type: string } => ({
  type: DIVISIONS_FETCH_FAILURE,
});

export const getDivisions: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (eventId: string) => async (dispatch: Dispatch) => {
  const data = await api.get(`/divisions?event_id=${eventId}`);
  dispatch(divisionsFetchSuccess(data));
};
