import { EVENTS_FETCH_SUCCESS, EVENTS_FETCH_FAILURE } from './actionTypes';
import api from 'api/api';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Toasts } from 'components/common';

export const eventsFetchSuccess = (
  payload: EventDetailsDTO[]
): { type: string; payload: EventDetailsDTO[] } => ({
  type: EVENTS_FETCH_SUCCESS,
  payload,
});

export const eventDetailsFetchFailure = (): { type: string } => ({
  type: EVENTS_FETCH_FAILURE,
});

export const getEvents: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const data = await api.get('/events');
  if (!data) {
    dispatch(eventDetailsFetchFailure());
    return Toasts.errorToast("Couldn't load tournaments");
  }

  dispatch(eventsFetchSuccess(data));
};
