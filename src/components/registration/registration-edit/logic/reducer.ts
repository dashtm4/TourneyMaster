import {
  REGISTRATION_FETCH_SUCCESS,
  REGISTRATION_FETCH_FAILURE,
  REGISTRATION_UPDATE_SUCCESS,
  REGISTRATION_FETCH_START,
} from './actionTypes';
import { IRegistration } from 'common/models/registration';

export interface IState {
  data?: IRegistration;
  isLoading: boolean;
  error: boolean;
}

const defaultState: IState = {
  data: undefined,
  isLoading: false,
  error: false,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case REGISTRATION_FETCH_START: {
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    }
    case REGISTRATION_FETCH_SUCCESS: {
      return {
        ...state,
        data: { ...action.payload[0] },
        isLoading: false,
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
        isLoading: false,
        error: true,
      };
    }
    default:
      return state;
  }
};
