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
  DELETE_ORGANIZATION_SUCCESS,
  DELETE_ORGANIZATION_FAILURE,
} from './action-types';
import {
  organizationSchema,
  applyInvitationSchema,
} from './validation-schemas';
import { Toasts } from 'components/common';
import { IMember, IOrganization, IOrgMember } from 'common/models';
import { getVarcharEight } from 'helpers';
import { Auth } from 'aws-amplify';

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

const addUserToOrganization: ActionCreator<ThunkAction<
  void,
  {},
  null,
  organizationManagementAction
>> = (invCode: string) => async (dispatch: Dispatch) => {
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
      org_id: invCode,
    };

    await applyInvitationSchema.validate(orgMembers);

    await Api.post('/org_members', orgMembers);

    const organizations = await Api.get(`/organizations`);

    dispatch({
      type: ADD_USER_TO_ORGANIZATION_SUCCESS,
      payload: {
        organizations,
      },
    });

    Toasts.successToast('Success! You were added to the organization.');
  } catch (err) {
    Toasts.errorToast(err.message);

    dispatch({
      type: ADD_USER_TO_ORGANIZATION_FAILURE,
    });
  }
};

const createOrganization: ActionCreator<ThunkAction<
  void,
  {},
  null,
  organizationManagementAction
>> = (organizationData: IOrganization) => async (dispatch: Dispatch) => {
  try {
    const currentSession = await Auth.currentSession();
    const userEmail = currentSession.getIdToken().payload.email;
    const members = await Api.get(`/members?email_address=${userEmail}`);
    const member: IMember = members.find(
      (it: IMember) => it.email_address === userEmail
    );

    const organization = {
      ...organizationData,
      org_id: getVarcharEight(),
      is_active_YN: 1,
    };

    const orgMembers = {
      member_id: member.member_id,
      org_member_id: getVarcharEight(),
      org_id: organization.org_id,
    };

    await organizationSchema.validate(organization);

    await Api.post('/organizations', organization);

    await Api.post('/org_members', orgMembers);

    dispatch({
      type: CREATE_ORGANIZATION_SUCCESS,
      payload: {
        organization,
      },
    });

    Toasts.successToast('Success! You were added to the organization.');
  } catch (err) {
    Toasts.errorToast(err.message);

    dispatch({
      type: CREATE_ORGANIZATION_FAILURE,
    });
  }
};

const deleteOrganization: ActionCreator<ThunkAction<
  void,
  {},
  null,
  organizationManagementAction
>> = (organization: IOrganization) => async (dispatch: Dispatch) => {
  try {
    const currentSession = await Auth.currentSession();
    const userEmail = currentSession.getIdToken().payload.email;
    const members = await Api.get(`/members?email_address=${userEmail}`);
    const member: IMember = members.find(
      (it: IMember) => it.email_address === userEmail
    );
    const orgMembers = await Api.get('/org_members');
    const toBeDelOrgMember = orgMembers.find(
      (it: IOrgMember) =>
        it.member_id === member.member_id && it.org_id === organization.org_id
    );

    Api.delete(`/org_members?org_member_id=${toBeDelOrgMember.org_member_id}`);

    dispatch({
      type: DELETE_ORGANIZATION_SUCCESS,
      payload: {
        organization,
      },
    });
  } catch {
    dispatch({
      type: DELETE_ORGANIZATION_FAILURE,
    });
  }
};

export {
  loadOrganizations,
  createOrganization,
  addUserToOrganization,
  deleteOrganization,
};
