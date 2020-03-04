import {
  DIVISIONS_FETCH_SUCCESS,
  DIVISIONS_FETCH_FAILURE,
  POOLS_FETCH_SUCCESS,
  TEAMS_FETCH_SUCCESS,
  FETCH_START,
  ADD_DIVISION_SUCCESS,
  UPDATE_DIVISION_SUCCESS,
  DELETE_DIVISION_SUCCESS,
  ADD_POOL_SUCCESS,
  REGISTRATION_FETCH_SUCCESS,
} from './actionTypes';
import { IPool, ITeam, IDivision } from 'common/models';
import { IRegistration } from 'common/models/registration';

export interface IState {
  data?: Partial<IDivision>[];
  pools: IPool[];
  teams: ITeam[];
  registration?: IRegistration;
  isLoading: boolean;
  error: boolean;
}

const defaultState: IState = {
  data: [],
  pools: [],
  teams: [],
  registration: undefined,
  isLoading: true,
  error: false,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case FETCH_START: {
      return { ...defaultState };
    }
    case DIVISIONS_FETCH_SUCCESS: {
      return {
        ...state,
        data: action.payload.sort((a: IDivision, b: IDivision) =>
          a.short_name.localeCompare(b.short_name)
        ),
        isLoading: false,
        error: false,
      };
    }
    case DIVISIONS_FETCH_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    }
    case ADD_DIVISION_SUCCESS: {
      return {
        ...state,
        data: [...state.data, action.payload],
        isLoading: false,
        error: false,
      };
    }
    case UPDATE_DIVISION_SUCCESS: {
      return {
        ...state,
        data: [
          ...state.data?.map(division =>
            division.division_id === action.payload.division_id
              ? action.payload
              : division
          ),
        ],
        isLoading: false,
        error: false,
      };
    }
    case DELETE_DIVISION_SUCCESS: {
      return {
        ...state,
        data: [
          ...state.data?.filter(
            division => division.division_id !== action.payload
          ),
        ],
        isLoading: false,
        error: false,
      };
    }
    case ADD_POOL_SUCCESS: {
      return {
        ...state,
        pools: [...state.pools, action.payload],
        isLoading: false,
        error: false,
      };
    }
    case POOLS_FETCH_SUCCESS: {
      return {
        ...state,
        pools: [...state.pools, ...action.payload],
        error: false,
      };
    }
    case TEAMS_FETCH_SUCCESS: {
      return {
        ...state,
        teams: [...state.teams, ...action.payload],
        error: false,
      };
    }
    case REGISTRATION_FETCH_SUCCESS: {
      return {
        ...state,
        registration: action.payload[0],
        isLoading: false,
        error: false,
      };
    }
    default:
      return state;
  }
};
