import {
  EVENTS_FETCH_SUCCESS,
  FACILITIES_FETCH_SUCCESS,
  FIELDS_FETCH_SUCCESS,
} from './actionTypes';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import api from 'api/api';
import { Toasts } from 'components/common';
import { IFacility, IField } from 'common/models';

export const eventsFetchSuccess = (
  payload: EventDetailsDTO[]
): { type: string; payload: EventDetailsDTO[] } => ({
  type: EVENTS_FETCH_SUCCESS,
  payload,
});

export const facilitiesFetchSuccess = (
  payload: IFacility[]
): { type: string; payload: IFacility[] } => ({
  type: FACILITIES_FETCH_SUCCESS,
  payload,
});

export const fieldsFetchSuccess = (
  payload: IField[]
): { type: string; payload: IField[] } => ({
  type: FIELDS_FETCH_SUCCESS,
  payload,
});

export const getEvents: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const events = await api.get('/events');
  if (!events) {
    return Toasts.errorToast("Couldn't load tournaments");
  }
  dispatch(eventsFetchSuccess(events));
};

export const getFacilities: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const facilities = await api.get('/facilities');
  if (!facilities) {
    return Toasts.errorToast("Couldn't load facilities");
  }
  dispatch(facilitiesFetchSuccess(facilities));
};

export const getFields: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const fields = await api.get('/fields');
  if (!fields) {
    return Toasts.errorToast("Couldn't load fields");
  }
  dispatch(fieldsFetchSuccess(fields));
};
