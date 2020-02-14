import { DIVISION_FETCH_SUCCESS, DIVISION_FETCH_FAILURE } from './actionTypes';

const defaultState: any = {
  data: {},
  error: false,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case DIVISION_FETCH_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        error: false,
      };
    }
    case DIVISION_FETCH_FAILURE: {
      return {
        ...state,
        error: true,
      };
    }
    default:
      return state;
  }
};
