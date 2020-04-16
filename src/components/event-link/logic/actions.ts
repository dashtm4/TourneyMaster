import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import api from 'api/api';
import { DATA_FETCH_SUCCESS } from './actionTypes';

export const getDataSuccess = (
  payload: any
): { type: string; payload: any } => ({
  type: DATA_FETCH_SUCCESS,
  payload,
});

export const getData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const events = await api.get('/events');
  const divisions = await api.get('/divisions');
  const pools = await api.get('/pools');
  const fields = await api.get('/fields');
  const teams = await api.get('/teams');

  dispatch(getDataSuccess({ events, divisions, pools, fields, teams }));
};
