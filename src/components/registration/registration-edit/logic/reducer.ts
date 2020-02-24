import {
  REGISTRATION_FETCH_SUCCESS,
  REGISTRATION_FETCH_FAILURE,
  REGISTRATION_UPDATE_SUCCESS,
} from './actionTypes';
import { IRegistration } from 'common/models/registration';

export interface IState {
  data?: IRegistration;
  error: boolean;
}

const defaultState: IState = {
  data: undefined,
  error: false,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case REGISTRATION_FETCH_SUCCESS: {
      return {
        ...state,
        data: { ...action.payload[0] },
        error: false,
      };
    }
    case REGISTRATION_FETCH_FAILURE: {
      return {
        ...state,
        error: true,
      };
    }
    case REGISTRATION_UPDATE_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        error: true,
      };
    }
    default:
      return state;
  }
};
