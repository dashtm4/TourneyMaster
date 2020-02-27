import {
  TeamsAction,
  LOAD_DIVISIONS_TEAMS_START,
  LOAD_DIVISIONS_TEAMS_SUCCESS,
  LOAD_POOLS_START,
  LOAD_POOLS_SUCCESS,
  SAVE_TEAMS_SUCCESS,
} from './action-types';
import { IDisision, IPool, ITeam } from '../../../common/models';

const initialState = {
  divisions: [],
  pools: [],
  teams: [],
  isLoading: false,
  isLoaded: false,
};

export interface AppState {
  divisions: IDisision[];
  pools: IPool[];
  teams: ITeam[];
  isLoading: boolean;
  isLoaded: boolean;
}

const teamsReducer = (state: AppState = initialState, action: TeamsAction) => {
  switch (action.type) {
    case LOAD_DIVISIONS_TEAMS_START: {
      return { ...initialState, isLoading: true };
    }
    case LOAD_DIVISIONS_TEAMS_SUCCESS: {
      const { divisions, teams } = action.payload;

      return {
        ...state,
        divisions: divisions,
        teams: teams,
        isLoading: false,
        isLoaded: true,
      };
    }
    case LOAD_POOLS_START: {
      const { divisionId } = action.payload;

      return {
        ...state,
        divisions: state.divisions.map(it =>
          it.division_id === divisionId ? { ...it, isPoolsLoading: true } : it
        ),
      };
    }
    case LOAD_POOLS_SUCCESS: {
      const { pools, divisionId } = action.payload;

      return {
        ...state,
        divisions: state.divisions.map(it =>
          it.division_id === divisionId
            ? { ...it, isPoolsLoading: false, isPoolsLoaded: true }
            : it
        ),
        pools: [...state.pools, ...pools],
      };
    }

    case SAVE_TEAMS_SUCCESS: {
      const { teams } = action.payload;

      return { ...state, teams: teams };
    }
    default:
      return state;
  }
};

export default teamsReducer;
