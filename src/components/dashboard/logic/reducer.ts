import { EVENTS_FETCH_SUCCESS, EVENTS_FETCH_FAILURE } from './actionTypes';
import { EventDetailsDTO } from '../../event-details/logic/model';

export interface IState {
  data?: EventDetailsDTO[];
  error: boolean;
}

const defaultState: IState = {
  data: [],
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
        error: false,
      };
    }
    case EVENTS_FETCH_FAILURE: {
      return {
        ...state,
        error: true,
      };
    }
    default:
      return state;
  }
};
