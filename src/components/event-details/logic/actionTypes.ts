import { EventDetailsDTO } from './model';

export const EVENT_DETAILS_FETCH_SUCCESS = 'EVENT_DETAILS_FETCH_SUCCESS';
export const EVENT_DETAILS_FETCH_FAILURE = 'EVENT_DETAILS_FETCH_FAILURE';

export interface EventDetailsFetchSuccess {
  type: 'EVENT_DETAILS_FETCH_SUCCESS';
  payload: EventDetailsDTO[];
}

export interface EventDetailsFetchFailure {
  type: 'EVENT_DETAILS_FETCH_FAILURE';
}

export type EventDetailsAction =
  | EventDetailsFetchSuccess
  | EventDetailsFetchFailure;
