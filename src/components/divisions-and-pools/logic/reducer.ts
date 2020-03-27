import {
  DIVISIONS_TEAMS_FETCH_START,
  DIVISIONS_TEAMS_FETCH_SUCCESS,
  DIVISIONS_TEAMS_FETCH_FAILURE,
  POOLS_FETCH_SUCCESS,
  FETCH_DETAILS_START,
  ADD_DIVISION_SUCCESS,
  UPDATE_DIVISION_SUCCESS,
  DELETE_DIVISION_SUCCESS,
  ADD_POOL_SUCCESS,
  REGISTRATION_FETCH_SUCCESS,
  ALL_POOLS_FETCH_SUCCESS,
  SAVE_TEAMS_SUCCESS,
} from './actionTypes';
import { IPool, ITeam, IDivision } from 'common/models';
import { sortByField } from 'helpers';
import { SortByFilesTypes } from 'common/enums';
import { IRegistration } from 'common/models/registration';

export interface IDivisionAndPoolsState {
  data?: Partial<IDivision>[];
  pools: IPool[];
  teams: ITeam[];
  registration?: IRegistration;
  isLoading: boolean;
  areDetailsLoading: boolean;
  error: boolean;
}

const defaultState: IDivisionAndPoolsState = {
  data: [],
  pools: [],
  teams: [],
  registration: undefined,
  isLoading: true,
  areDetailsLoading: true,
  error: false,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case DIVISIONS_TEAMS_FETCH_START: {
      return { ...defaultState };
    }
    case FETCH_DETAILS_START: {
      return { ...state, pools: [], areDetailsLoading: true };
    }
    case DIVISIONS_TEAMS_FETCH_SUCCESS: {
      const { divisions, teams } = action.payload;

      return {
        ...state,
        data: sortByField(divisions, SortByFilesTypes.DIVISIONS),
        isLoading: false,
        error: false,
        teams,
      };
    }
    case DIVISIONS_TEAMS_FETCH_FAILURE: {
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
    case ALL_POOLS_FETCH_SUCCESS:
      return {
        ...state,
        pools: action.payload,
        error: false,
      };
    case REGISTRATION_FETCH_SUCCESS: {
      return {
        ...state,
        registration: action.payload[0],
        isLoading: false,
        error: false,
      };
    }
    case SAVE_TEAMS_SUCCESS: {
      const { teams } = action.payload;

      return {
        ...state,
        teams,
      };
    }
    default:
      return state;
  }
};
