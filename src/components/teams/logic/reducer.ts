import {
  TeamsAction,
  CHANGE_POOL,
  LOAD_DIVISIONS_TEAMS_START,
  LOAD_DIVISIONS_TEAMS_SUCCESS,
  LOAD_POOLS_START,
  LOAD_POOLS_SUCCESS,
  EDIT_TEAM_SUCCESS,
  DELETE_TEAM_SUCCESS,
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
    case CHANGE_POOL: {
      const { changedTeam } = action.payload;

      return {
        ...state,
        teams: state.teams.map(it =>
          it.team_id === changedTeam.team_id ? changedTeam : it
        ),
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
      const { team } = action.payload;

      return {
        ...state,
        teams: state.teams.filter(it => it.team_id !== team.team_id),
      };
    }
    default:
      return state;
  }
};

export default teamsReducer;
