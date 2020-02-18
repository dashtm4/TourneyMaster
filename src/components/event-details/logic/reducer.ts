import {
  EVENT_DETAILS_FETCH_SUCCESS,
  EVENT_DETAILS_FETCH_FAILURE,
  EventDetailsAction,
} from './actionTypes';
import { EventDetailsDTO } from './model';

export interface IAppState {
  data?: EventDetailsDTO;
  error: boolean;
}

const defaultState: IAppState = {
  data: undefined,
  error: false,
};

export default (state = defaultState, action: EventDetailsAction) => {
  switch (action.type) {
    case EVENT_DETAILS_FETCH_SUCCESS: {
      return {
        ...state,
        data: {
          ...action.payload[0],
        },
        error: false,
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
