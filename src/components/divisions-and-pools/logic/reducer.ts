import {
  DIVISIONS_FETCH_SUCCESS,
  DIVISIONS_FETCH_FAILURE,
  POOLS_FETCH_SUCCESS,
  TEAMS_FETCH_SUCCESS,
} from './actionTypes';
import { IDivision } from 'common/models/divisions';
import { IPool, ITeam } from 'common/models';

export interface IState {
  data?: Partial<IDivision>[];
  pools: IPool[];
  teams: ITeam[];
  error: boolean;
}

const defaultState: IState = {
  data: [],
  pools: [],
  teams: [],
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
    case POOLS_FETCH_SUCCESS: {
      return {
        ...state,
        pools: action.payload,
        error: false,
      };
    }
    case TEAMS_FETCH_SUCCESS: {
      return {
        ...state,
        teams: action.payload,
        error: false,
      };
    }
    default:
      return state;
  }
};
