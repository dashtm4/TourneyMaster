import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import api from 'api/api';
import { DATA_FETCH_SUCCESS } from './actionTypes';
import { Toasts } from 'components/common';
import { IMessage } from '../create-message';
import history from 'browserhistory';
import { getVarcharEight } from 'helpers';
import { Auth } from 'aws-amplify';
import { IMember } from 'common/models';

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

export const saveMessage: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (data: IMessage) => async () => {
  const currentSession = await Auth.currentSession();
  const userEmail = currentSession.getIdToken().payload.email;
  const members = await api.get(`/members?email_address=${userEmail}`);
  const member = members.find((it: IMember) => it.email_address === userEmail);

  const message = {
    message_id: getVarcharEight(),
    member_id: member.member_id,
    message_type: data.type,
    recipient_details: JSON.stringify(data.recipients),
    message_title: data.title,
    message_body: data.message,
    send_datetime: new Date().toISOString(),
  };
  console.log(message);

  const response = await api.post('/messaging', message);
  console.log(response);
};
