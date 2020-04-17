import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import api from 'api/api';
import { DATA_FETCH_SUCCESS } from './actionTypes';
import { Toasts } from 'components/common';
import { IMessage } from '../create-message';
import history from 'browserhistory';

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

export const sendMessage: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (data: IMessage) => async () => {
  if (!data.message) {
    return Toasts.errorToast('Please, provide a message');
  }
  const response = await api.post('/event-link', data);

  if (!response || response.status === 500) {
    return Toasts.errorToast(response.message);
  }
  history.push('/event-link');
  return Toasts.successToast(response.message);
};
