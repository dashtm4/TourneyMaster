import {
  TeamsAction,
  SUCCESS,
  LOAD_DIVISIONS,
  LOAD_POOLS,
  LOAD_TEAMS,
} from './action-types';
import { IDisision, IPool, ITeam } from '../../../common/models';

const initialState = {
  divisions: [],
  pools: [],
  teams: [],
};

export interface AppState {
  divisions: IDisision[];
  pools: IPool[];
  teams: ITeam[];
}

const teamsReducer = (state: AppState = initialState, action: TeamsAction) => {
  switch (action.type) {
    case LOAD_DIVISIONS + SUCCESS:
      return { ...state, divisions: action.payload };
    case LOAD_POOLS + SUCCESS:
      return {
        ...state,
        pools: [...state.pools, ...action.payload],
      };
    case LOAD_TEAMS + SUCCESS:
      return {
        ...state,
        teams: [...state.teams, ...action.payload],
      };
    default:
      return state;
  }
};

export default teamsReducer;
