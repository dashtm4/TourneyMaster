import {
  DIVISIONS_FETCH_SUCCESS,
  DIVISIONS_FETCH_FAILURE,
  POOLS_FETCH_SUCCESS,
  TEAMS_FETCH_SUCCESS,
  FETCH_START,
  ADD_DIVISION_SUCCESS,
  UPDATE_DIVISION_SUCCESS,
  DELETE_DIVISION_SUCCESS,
  ADD_POOL_SUCCESS,
  REGISTRATION_FETCH_SUCCESS,
  DIVISION_SAVE_SUCCESS,
} from './actionTypes';
import api from 'api/api';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import history from '../../../browserhistory';
import { Toasts } from 'components/common';
import { getVarcharEight } from 'helpers';
import { IPool, ITeam, IDivision } from 'common/models';

export const fetchStart = (): { type: string } => ({
  type: FETCH_START,
});

export const divisionsFetchSuccess = (
  payload: IDivision
): { type: string; payload: IDivision } => ({
  type: DIVISIONS_FETCH_SUCCESS,
  payload,
});

export const divisionsFetchFailure = (): { type: string } => ({
  type: DIVISIONS_FETCH_FAILURE,
});

export const addDivisionSuccess = (
  payload: IDivision
): { type: string; payload: IDivision } => ({
  type: ADD_DIVISION_SUCCESS,
  payload,
});

export const updateDivisionSuccess = (
  payload: IDivision
): { type: string; payload: IDivision } => ({
  type: UPDATE_DIVISION_SUCCESS,
  payload,
});

export const deleteDivisionSuccess = (
  payload: string
): { type: string; payload: string } => ({
  type: DELETE_DIVISION_SUCCESS,
  payload,
});

export const addPoolSuccess = (
  payload: IPool
): { type: string; payload: IPool } => ({
  type: ADD_POOL_SUCCESS,
  payload,
});

export const poolsFetchSuccess = (
  payload: IPool[]
): { type: string; payload: IPool[] } => ({
  type: POOLS_FETCH_SUCCESS,
  payload,
});

export const teamsFetchSuccess = (
  payload: ITeam[]
): { type: string; payload: ITeam[] } => ({
  type: TEAMS_FETCH_SUCCESS,
  payload,
});

export const registrationFetchSuccess = (
  payload: any
): { type: string; payload: any } => ({
  type: REGISTRATION_FETCH_SUCCESS,
  payload,
});

export const getDivisions: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (eventId: string) => async (dispatch: Dispatch) => {
  dispatch(fetchStart());
  const data = await api.get(`/divisions?event_id=${eventId}`);
  dispatch(divisionsFetchSuccess(data));
};

export const getPools: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisionId: string) => async (dispatch: Dispatch) => {
  const data = await api.get(`/pools?division_id=${divisionId}`);
  dispatch(poolsFetchSuccess(data));
};

export const getTeams: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisionId: string) => async (dispatch: Dispatch) => {
  const data = await api.get(`/teams?division_id=${divisionId}`);
  dispatch(teamsFetchSuccess(data));
};

export const updateDivision: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (division: IDivision) => async (dispatch: Dispatch) => {
  const response = await api.put(
    `/divisions?division_id=${division.division_id}`,
    division
  );

  dispatch(updateDivisionSuccess(division));

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't update a division");
  }

  history.goBack();

  Toasts.successToast('Division is successfully updated');
};

export const saveDivisionsSuccess = (divisions: IDivision[]) => ({
  type: DIVISION_SAVE_SUCCESS,
  payload: divisions,
});

export const saveDivisions: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisions: IDivision[], eventId: string) => async (
  dispatch: Dispatch
) => {
  for await (const division of divisions) {
    const data = {
      ...division,
      event_id: eventId,
      division_id: getVarcharEight(),
    };
    const response = await api.post(`/divisions`, data);

    dispatch(addDivisionSuccess(data));

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't add a division");
    }
  }

  dispatch(saveDivisionsSuccess(divisions));

  history.push(`/event/divisions-and-pools/${eventId}`);

  Toasts.successToast('Division is successfully added');
};

export const deleteDivision: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisionId: string) => async (dispatch: Dispatch) => {
  const response = await api.delete(`/divisions?division_id=${divisionId}`);

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't delete a division");
  }

  dispatch(deleteDivisionSuccess(divisionId));

  history.goBack();

  Toasts.successToast('Division is successfully deleted');
};

export const savePool: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (pool: IPool) => async (dispatch: Dispatch) => {
  const data = {
    ...pool,
    pool_id: getVarcharEight(),
  };

  const response = await api.post(`/pools`, data);

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't add a pool division");
  }

  dispatch(addPoolSuccess(data));

  Toasts.successToast('Pool is successfully added');
};

export const getRegistration: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (eventId: string) => async (dispatch: Dispatch) => {
  const data = await api.get(`/registrations?event_id=${eventId}`);
  dispatch(registrationFetchSuccess(data));
};
