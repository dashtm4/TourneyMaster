import {
  TeamsAction,
  SUCCESS,
  LOAD_DIVISION,
  LOAD_POOLS,
  LOAD_TEAMS,
  EDIT_TEAM,
  DELETE_TEAM,
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

const scoringReducer = (
  state: AppState = initialState,
  action: TeamsAction
) => {
  switch (action.type) {
    case LOAD_DIVISION + SUCCESS:
      return { ...state, divisions: action.payload };
    case LOAD_POOLS + SUCCESS:
      return {
        ...state,
        pools: [...state.pools, ...(action.payload as IPool[])],
      };
    case LOAD_TEAMS + SUCCESS:
      return { ...state, teams: action.payload };
    case EDIT_TEAM + SUCCESS:
      const editedTeam = action.payload as ITeam;

      return {
        ...state,
        teams: state.teams.map(it =>
          it.team_id === editedTeam.team_id ? editedTeam : it
        ),
      };
    case DELETE_TEAM + SUCCESS:
      return {
        ...state,
        teams: state.teams.filter(it => it.team_id !== action.payload),
      };
    default:
      return state;
  }
};

export default scoringReducer;
