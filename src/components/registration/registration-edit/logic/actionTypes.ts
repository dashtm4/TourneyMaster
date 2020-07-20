import { IRegistration, IEventDetails } from 'common/models';

export const REGISTRATION_FETCH_START = 'REGISTRATION_FETCH_START';
export const REGISTRATION_FETCH_SUCCESS = 'REGISTRATION_FETCH_SUCCESS';
export const REGISTRATION_FETCH_FAILURE = 'REGISTRATION_FETCH_FAILURE';
export const REGISTRATION_UPDATE_SUCCESS = 'REGISTRATION_UPDATE_SUCCESS';
export const DIVISIONS_FETCH_SUCCESS = 'REGISTRATION_DIVISIONS_FETCH_SUCCESS';
export const EVENT_FETCH_SUCCESS = 'REGISTRATION_EVENT_FETCH_SUCCESS';
export const REGISTRANTS_FETCH_SUCCESS = 'REGISTRANTS_FETCH_SUCCESS';
export const REGISTRANTS_ADD_TO_EVENT_SUCCESS =
  'REGISTRANTS_ADD_TO_EVENT_SUCCESS';
export const REGISTRANTS_PAYMENTS_FETCH_SUCCESS =
  'REGISTRANTS_PAYMENTS_FETCH_SUCCESS';

export const LOAD_CUSTOM_DATA_SUCCESS = 'LOAD_CUSTOM_DATA_SUCCESS';
export const UPDATE_REQUESTED_IDS_SUCCESS = 'UPDATE_REQUESTED_IDS_SUCCESS';
export const SWAP_REQUESTED_IDS_SUCCESS = 'SWAP_REQUESTED_IDS_SUCCESS';
export const UPDATE_OPTIONS_SUCCESS = 'UPDATE_OPTIONS_SUCCESS';

export interface registrationUpdateSuccess {
  type: 'REGISTRATION_UPDATE_SUCCESS';
  payload: IRegistration;
  event: IEventDetails | null;
}

export type RegistrationAction = registrationUpdateSuccess;
