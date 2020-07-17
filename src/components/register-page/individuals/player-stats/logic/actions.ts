import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import { Auth } from 'aws-amplify';
import Api from 'api/api';
import { Toasts } from 'components/common';
import { IMember } from 'common/models';
import {
  LOAD_REGISTRANT_DATA_START,
  LOAD_REGISTRANT_DATA_SUCCESS,
  LOAD_REGISTRANT_DATA_FAIL,
  LOAD_FORM_FIELDS_START,
  LOAD_FORM_FIELDS_SUCCESS,
  LOAD_FORM_FIELDS_FAIL,
  PlayerStatsAction,
} from './action-types';

export const loadRegistrantData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  PlayerStatsAction
>> = () => async (dispatch: Dispatch) => {
  console.log('>>> loadRegistrantData');
  try {
    dispatch({
      type: LOAD_REGISTRANT_DATA_START,
      payload: '',
    });

    const currentSession = await Auth.currentSession();
    const userEmail = currentSession.getIdToken().payload.email;
    const members = await Api.get(`/members?email_address=${userEmail}`);
    const member: IMember = members.find(
      (it: IMember) => it.email_address === userEmail
    );

    const registrantDefaultFields = await Api.get(
      '/registrant_data_fields?is_default_YN=1'
    );
    const registrantUserDefinedFields = await Api.get(
      `/registrant_data_fields?created_by=${member.member_id}`
    );

    const fieldIds: number[] = [];
    const registrantDataFields = [
      ...registrantDefaultFields,
      ...registrantUserDefinedFields,
    ].filter((el) => {
      if (fieldIds.some((id: number) => id === el.data_field_id)) {
        return false;
      } else {
        fieldIds.push(el.data_field_id);
        return true;
      }
    });

    dispatch({
      type: LOAD_REGISTRANT_DATA_SUCCESS,
      payload: { registrantDataFields },
    });
  } catch {
    dispatch({
      type: LOAD_REGISTRANT_DATA_FAIL,
    });

    Toasts.errorToast("Couldn't load Registrant fields");
  }
};

export const loadFormFields: ActionCreator<ThunkAction<
  void,
  {},
  null,
  PlayerStatsAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_FORM_FIELDS_START,
      payload: '',
    });

    const requestedFieldsResponse = await Api.get(
      `/registrant_data_requests?event_id=${eventId}`
    );

    const currentSession = await Auth.currentSession();
    const userEmail = currentSession.getIdToken().payload.email;
    const members = await Api.get(`/members?email_address=${userEmail}`);
    const member: IMember = members.find(
      (it: IMember) => it.email_address === userEmail
    );

    const registrantDefaultFields = await Api.get(
      '/registrant_data_fields?is_default_YN=1'
    );
    const registrantUserDefinedFields = await Api.get(
      `/registrant_data_fields?created_by=${member.member_id}`
    );

    const fieldIds: number[] = [];
    const registrantDataFields = [
      ...registrantDefaultFields,
      ...registrantUserDefinedFields,
    ]
      .filter((el) => {
        if (fieldIds.some((id: number) => id === el.data_field_id)) {
          return false;
        } else {
          fieldIds.push(el.data_field_id);
          return true;
        }
      })
      .map((el) => {
        const requestedFields = requestedFieldsResponse.filter(
          (requestedField: any) =>
            requestedField.data_field_id === el.data_field_id
        );
        if (requestedFields.length > 0) {
          const {
            data_sort_order,
            is_required_YN,
            request_id,
          } = requestedFields[0];
          return { ...el, data_sort_order, is_required_YN, request_id };
        } else {
          return null;
        }
      })
      .filter((el) => el)
      .sort((a: any, b: any) => {
        const fieldA = a.data_sort_order;
        const fieldB = b.data_sort_order;

        let comparison = 0;
        if (fieldA > fieldB) {
          comparison = 1;
        } else if (fieldA < fieldB) {
          comparison = -1;
        }
        return comparison;
      });

    dispatch({
      type: LOAD_FORM_FIELDS_SUCCESS,
      payload: { formFields: registrantDataFields },
    });
  } catch {
    dispatch({
      type: LOAD_FORM_FIELDS_FAIL,
    });

    Toasts.errorToast("Couldn't load Registrant fields");
  }
};
