import { EVENTS_FETCH_SUCCESS, EVENTS_FETCH_FAILURE } from './actionTypes';
import { EventDetailsDTO } from '../../event-details/logic/model';

export interface IState {
  data?: EventDetailsDTO[];
  isLoading: boolean;
  error: boolean;
}

const defaultState: IState = {
  data: [],
  isLoading: true,
  error: false,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case EVENTS_FETCH_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        error: false,
      };
    }
    case EVENTS_FETCH_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    }
    default:
      return state;
  }
};
