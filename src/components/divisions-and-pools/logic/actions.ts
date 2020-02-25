import {
  DIVISIONS_FETCH_SUCCESS,
  DIVISIONS_FETCH_FAILURE,
  POOLS_FETCH_SUCCESS,
  TEAMS_FETCH_SUCCESS,
} from './actionTypes';
import api from 'api/api';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IDivision } from 'common/models/divisions';

export const divisionsFetchSuccess = (
  payload: IDivision
): { type: string; payload: IDivision } => ({
  type: DIVISIONS_FETCH_SUCCESS,
  payload,
});

export const divisionsFetchFailure = (): { type: string } => ({
  type: DIVISIONS_FETCH_FAILURE,
});

export const poolsFetchSuccess = (
  payload: any
): { type: string; payload: any } => ({
  type: POOLS_FETCH_SUCCESS,
  payload,
});

export const teamsFetchSuccess = (
  payload: any
): { type: string; payload: any } => ({
  type: TEAMS_FETCH_SUCCESS,
  payload,
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

export const getPools: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (eventId: string) => async (dispatch: Dispatch) => {
  const data = await api.get(`/pools?event_id=${eventId}`);
  dispatch(poolsFetchSuccess(data));
};

export const getTeams: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (eventId: string) => async (dispatch: Dispatch) => {
  const data = await api.get(`/teams?event_id=${eventId}`);
  console.log(data);
  dispatch(teamsFetchSuccess(data));
};
