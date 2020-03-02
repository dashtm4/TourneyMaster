import {
  REGISTRATION_FETCH_SUCCESS,
  REGISTRATION_FETCH_FAILURE,
  REGISTRATION_UPDATE_SUCCESS,
  REGISTRATION_FETCH_START,
  DIVISIONS_FETCH_SUCCESS,
} from './actionTypes';
import { IRegistration } from 'common/models/registration';
import { IDivision } from 'common/models';

export interface IState {
  data?: Partial<IRegistration>;
  divisions: IDivision[];
  isLoading: boolean;
  error: boolean;
}

const defaultState: IState = {
  data: undefined,
  divisions: [],
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
        data: action.payload[0],
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
    case DIVISIONS_FETCH_SUCCESS: {
      return {
        ...state,
        divisions: action.payload.sort((a: IDivision, b: IDivision) =>
          a.short_name.localeCompare(b.short_name)
        ),
        isLoading: false,
        error: false,
      };
    }
    default:
      return state;
  }
};
