import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import jwt_decode from 'jwt-decode';
import Api from 'api/api';
import {
  organizationManagementAction,
  LOAD_ORGANIZATIONS_START,
  LOAD_ORGANIZATIONS_SUCCESS,
  LOAD_ORGANIZATIONS_FAILURE,
  CREATE_ORGANIZATION_SUCCESS,
  CREATE_ORGANIZATION_FAILURE,
} from './action-types';
import { IMember } from 'common/models';
import { getVarcharEight } from 'helpers';
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

const addUserToOrganization = async ({ orgId, invCode }: IAddUserToOrg) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }

  const decodedToken = jwt_decode(token);
  const { email } = decodedToken as any;
  const members = await Api.get(`/members?email_address=${email}`);
  const member: IMember = members.find(
    (it: IMember) => it.email_address === email
  );

  const orgMembers = {
    member_id: member.member_id,
    org_member_id: getVarcharEight(),
    org_id: orgId || invCode,
  };

  await Api.post('/org_members', orgMembers);
};

export { loadOrganizations, createOrganization, addUserToOrganization };
