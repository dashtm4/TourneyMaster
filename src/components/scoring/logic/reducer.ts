import {
  TeamsAction,
  LOAD_DIVISION_START,
  LOAD_DIVISION_SUCCESS,
  LOAD_POOLS_SUCCESS,
  LOAD_TEAMS_START,
  LOAD_TEAMS_SUCCESS,
  EDIT_TEAM_SUCCESS,
  DELETE_TEAM_SUCCESS,
  LOAD_POOLS_START,
} from './action-types';
import { IDivision, IPool, ITeam } from '../../../common/models';

const initialState = {
  isLoading: false,
  isLoaded: true,
  divisions: [],
  pools: [],
  teams: [],
};

export interface AppState {
  isLoading: boolean;
  isLoaded: boolean;
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
}

const scoringReducer = (
  state: AppState = initialState,
  action: TeamsAction
) => {
  switch (action.type) {
    case LOAD_DIVISION_START: {
      return { ...initialState, isLoading: true };
    }
    case LOAD_DIVISION_SUCCESS: {
      const { divisions } = action.payload;

      return { ...state, divisions, isLoading: false, isLoaded: true };
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
      const { divisionId, pools } = action.payload;

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
    case LOAD_TEAMS_START: {
      const { poolId } = action.payload;

      return {
        ...state,
        pools: state.pools.map(it =>
          it.pool_id === poolId ? { ...it, isTeamsLoading: true } : it
        ),
      };
    }
    case LOAD_TEAMS_SUCCESS: {
      const { poolId, teams } = action.payload;

      return {
        ...state,
        pools: state.pools.map(it =>
          it.pool_id === poolId
            ? { ...it, isTeamsLoading: false, isTeamsLoaded: true }
            : it
        ),
        teams: [...state.teams, ...teams],
      };
    }
    case EDIT_TEAM_SUCCESS: {
      const { team } = action.payload;

      return {
        ...state,
        teams: state.teams.map(it => (it.team_id === team.team_id ? team : it)),
      };
    }
    case DELETE_TEAM_SUCCESS: {
      const { teamId } = action.payload;

      return {
        ...state,
        teams: state.teams.filter(it => it.team_id !== teamId),
      };
    }
    default:
      return state;
  }
};

export default scoringReducer;
