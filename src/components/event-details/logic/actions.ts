import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';

import {
  EVENT_DETAILS_FETCH_SUCCESS,
  EVENT_DETAILS_FETCH_FAILURE,
  EventDetailsAction,
} from './actionTypes';

import api from 'api/api';
import { EventDetailsDTO } from './model';
import { Toasts } from 'components/common';

export const eventDetailsFetchSuccess = (
  payload: EventDetailsDTO[]
): EventDetailsAction => ({
  type: EVENT_DETAILS_FETCH_SUCCESS,
  payload,
});

export const eventDetailsFetchFailure = (): EventDetailsAction => ({
  type: EVENT_DETAILS_FETCH_FAILURE,
});

export const getEventDetails: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  const eventDetails = await api.get('/events', { event_id: eventId });
  if (eventDetails) {
    dispatch(eventDetailsFetchSuccess(eventDetails));
  } else {
    dispatch(eventDetailsFetchFailure());
  }
};

export const saveEventDetails: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventDetails: EventDetailsDTO) => async (/* dispatch: Dispatch */) => {
  const response = await api.post(`/events`, eventDetails);

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't save the changes");
  }

  Toasts.successToast('Changes successfully saved');
};
