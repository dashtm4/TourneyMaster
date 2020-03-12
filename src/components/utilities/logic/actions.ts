import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import { Auth } from 'aws-amplify';
import {
  UtilitiesAction,
  LOAD_USER_DATA_START,
  LOAD_USER_DATA_SUCCESS,
  LOAD_USER_DATA_FAILURE,
  CHANGE_USER,
} from './action-types';
import Api from 'api/api';
import { IMember } from 'common/models';

const loadUserData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  UtilitiesAction
>> = () => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_USER_DATA_START,
    });

    const currentSession = await Auth.currentSession();
    const userEmail = currentSession.getIdToken().payload.email;
    const members = await Api.get(`/members?email_address=${userEmail}`);
    const member: IMember = members.find(
      (it: IMember) => it.email_address === userEmail
    );

    dispatch({
      type: LOAD_USER_DATA_SUCCESS,
      payload: {
        userData: member,
      },
    });
  } catch {
    dispatch({
      type: LOAD_USER_DATA_FAILURE,
    });
  }
};

const changeUser = (userNewField: Partial<IMember>) => ({
  type: CHANGE_USER,
  payload: {
    userNewField,
  },
});

export { loadUserData, changeUser };
