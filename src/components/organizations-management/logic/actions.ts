import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import Api from 'api/api';
import {
  organizationManagementAction,
  LOAD_ORGANIZATIONS_START,
  LOAD_ORGANIZATIONS_SUCCESS,
  LOAD_ORGANIZATIONS_FAILURE,
  CREATE_ORGANIZATION_SUCCESS,
  CREATE_ORGANIZATION_FAILURE,
  ADD_USER_TO_ORGANIZATION_SUCCESS,
  ADD_USER_TO_ORGANIZATION_FAILURE,
} from './action-types';
import { Toasts } from 'components/common';
import { IMember } from 'common/models';
import { getVarcharEight } from 'helpers';
import { Auth } from 'aws-amplify';
import { IAddUserToOrg } from '../types';

const loadOrganizations: ActionCreator<ThunkAction<
  void,
  {},
  null,
  organizationManagementAction
>> = () => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_ORGANIZATIONS_START,
    });

    const organizations = await Api.get(`/organizations`);

    dispatch({
      type: LOAD_ORGANIZATIONS_SUCCESS,
      payload: {
        organizations,
      },
    });
  } catch {
    dispatch({
      type: LOAD_ORGANIZATIONS_FAILURE,
    });
  }
};

const createOrganization: ActionCreator<ThunkAction<
  void,
  {},
  null,
  organizationManagementAction
>> = organization => async (dispatch: Dispatch) => {
  try {
    await Api.post('/organizations', organization);

    dispatch({
      type: CREATE_ORGANIZATION_SUCCESS,
      payload: {
        organization,
      },
    });
  } catch {
    dispatch({
      type: CREATE_ORGANIZATION_FAILURE,
    });
  }
};

const addUserToOrganization: ActionCreator<ThunkAction<
  void,
  {},
  null,
  organizationManagementAction
>> = ({ orgId, invCode }: IAddUserToOrg) => async (dispatch: Dispatch) => {
  try {
    const currentSession = await Auth.currentSession();
    const userEmail = currentSession.getIdToken().payload.email;
    const members = await Api.get(`/members?email_address=${userEmail}`);

    const member: IMember = members.find(
      (it: IMember) => it.email_address === userEmail
    );

    const orgMembers = {
      member_id: member.member_id,
      org_member_id: getVarcharEight(),
      org_id: orgId || invCode,
    };

    await Api.post('/org_members', orgMembers);

    const organizations = await Api.get(`/organizations`);

    dispatch({
      type: ADD_USER_TO_ORGANIZATION_SUCCESS,
      payload: {
        organizations,
      },
    });

    Toasts.successToast('Success! You were added to the organization.');
  } catch {
    dispatch({
      type: ADD_USER_TO_ORGANIZATION_FAILURE,
    });

    Toasts.errorToast('Oops. Something went wrong...');
  }
};

export { loadOrganizations, createOrganization, addUserToOrganization };
