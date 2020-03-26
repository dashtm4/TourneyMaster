import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as Yup from 'yup';
import {
  DIVISIONS_FETCH_SUCCESS,
  DIVISIONS_FETCH_FAILURE,
  POOLS_FETCH_SUCCESS,
  TEAMS_FETCH_SUCCESS,
  FETCH_DETAILS_START,
  ADD_DIVISION_SUCCESS,
  UPDATE_DIVISION_SUCCESS,
  DELETE_DIVISION_SUCCESS,
  ADD_POOL_SUCCESS,
  REGISTRATION_FETCH_SUCCESS,
  DIVISION_SAVE_SUCCESS,
  ALL_POOLS_FETCH_SUCCESS,
} from './actionTypes';
import api from 'api/api';
import history from '../../../browserhistory';
import { divisionSchema, poolSchema } from 'validations';
import { Toasts } from 'components/common';
import { getVarcharEight } from 'helpers';
import { IPool, ITeam, IDivision } from 'common/models';

export const fetchDetailsStart = (): { type: string } => ({
  type: FETCH_DETAILS_START,
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

export const allPoolsFetchSuccess = (
  payload: IPool[]
): { type: string; payload: IPool[] } => ({
  type: ALL_POOLS_FETCH_SUCCESS,
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
  const data = await api.get(`/divisions?event_id=${eventId}`);
  dispatch(divisionsFetchSuccess(data));
};

export const getPools: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisionId: string) => async (dispatch: Dispatch) => {
  dispatch(fetchDetailsStart());

  const data = await api.get(`/pools?division_id=${divisionId}`);
  dispatch(poolsFetchSuccess(data));
};

export const getAllPools: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisionIds: string[]) => async (dispatch: Dispatch) => {
  dispatch(fetchDetailsStart());
  const pools: any[] = [];
  await Promise.all(
    divisionIds.map(async item => {
      const response = await api.get(`/pools?division_id=${item}`);
      pools.push(response);
    })
  );
  dispatch(allPoolsFetchSuccess(pools.flat()));
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
  try {
    const allDivisions = await api.get(
      `/divisions?event_id=${division.event_id}`
    );

    await Yup.array()
      .of(divisionSchema)
      .unique(
        division => division.long_name,
        'Oops. It looks like you already have division with the same long name. The division must have a unique long name.'
      )
      .unique(
        division => division.short_name,
        'Oops. It looks like you already have division with the same short name. The division must have a unique short name.'
      )
      .validate(
        allDivisions.map((it: IDivision) =>
          it.division_id === division.division_id ? division : it
        )
      );

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
  } catch (err) {
    Toasts.errorToast(err.message);
  }
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
  try {
    const allDivisions = await api.get(`/divisions?event_id=${eventId}`);

    await Yup.array()
      .of(divisionSchema)
      .unique(
        division => division.long_name,
        'Oops. It looks like you already have division with the same long name. The division must have a unique long name.'
      )
      .unique(
        division => division.short_name,
        'Oops. It looks like you already have division with the same short name. The division must have a unique short name.'
      )
      .validate([...allDivisions, ...divisions]);

    for await (const division of divisions) {
      const data = {
        ...division,
        event_id: eventId,
        division_id: getVarcharEight(),
      };

      await divisionSchema.validate(division);

      const response = await api.post(`/divisions`, data);

      dispatch(addDivisionSuccess(data));

      if (response?.errorType === 'Error') {
        return Toasts.errorToast("Couldn't add a division");
      }
    }

    dispatch(saveDivisionsSuccess(divisions));

    history.push(`/event/divisions-and-pools/${eventId}`);

    Toasts.successToast('Division is successfully added');
  } catch (err) {
    Toasts.errorToast(err.message);
  }
};

export const deleteDivision: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisionId: string, pools: IPool[], teams: ITeam[]) => async (
  dispatch: Dispatch
) => {
  pools.forEach(pool => api.delete(`/pools?pool_id=${pool.pool_id}`));
  teams.forEach(team =>
    api.put(`/teams?team_id=${team.team_id}`, {
      pool_id: null,
      division_id: null,
    })
  );
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
  try {
    const data = {
      ...pool,
      pool_id: getVarcharEight(),
    };
    const allPools = await api.get(`/pools?division_id=${pool.division_id}`);

    await Yup.array()
      .of(poolSchema)
      .unique(
        pool => pool.pool_name,
        'Oops. It looks like you already have pool with the same name. The pool must have a unique name.'
      )
      .validate([...allPools, data]);

    const response = await api.post(`/pools`, data);

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't add a pool division");
    }

    dispatch(addPoolSuccess(data));

    Toasts.successToast('Pool is successfully added');
  } catch (err) {
    Toasts.errorToast(err.message);
  }
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
