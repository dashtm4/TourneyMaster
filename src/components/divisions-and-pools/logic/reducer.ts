import {
  DIVISIONS_FETCH_SUCCESS,
  DIVISIONS_FETCH_FAILURE,
} from './actionTypes';

export interface IState {
  data?: any;
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
    case DIVISIONS_FETCH_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        error: false,
      };
    }
    case DIVISIONS_FETCH_FAILURE: {
      return {
        ...state,
        error: true,
      };
    }
    default:
      return state;
  }
};
