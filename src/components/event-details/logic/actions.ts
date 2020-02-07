import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';

import {
  EVENT_DETAILS_FETCH_SUCCESS,
  EVENT_DETAILS_FETCH_FAILURE,
  EventDetailsAction,
} from './actionTypes';

import api from 'api/api';
import { EventDetailsDTO } from './model';

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
