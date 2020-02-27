import {
  EVENT_DETAILS_FETCH_START,
  EVENT_DETAILS_FETCH_SUCCESS,
  EVENT_DETAILS_FETCH_FAILURE,
  EventDetailsAction,
} from './actionTypes';
import { EventDetailsDTO } from './model';

export interface IAppState {
  data?: EventDetailsDTO;
  error: boolean;
  isEventLoading: boolean;
  isEventLoaded: boolean;
}

const defaultState: IAppState = {
  data: undefined,
  isEventLoading: false,
  isEventLoaded: false,
  error: false,
};

export default (state = defaultState, action: EventDetailsAction) => {
  switch (action.type) {
    case EVENT_DETAILS_FETCH_START: {
      return {
        ...state,
        data: {
          ...state.data,
        },
        isEventLoading: true,
      };
    }
    case EVENT_DETAILS_FETCH_SUCCESS: {
      return {
        ...state,
        data: {
          ...action.payload[0],
        },
        isEventLoading: false,
        isEventLoaded: true,
      };
    }
    case EVENT_DETAILS_FETCH_FAILURE: {
      return {
        ...state,
        error: true,
      };
    }
    default:
      return state;
  }
};
