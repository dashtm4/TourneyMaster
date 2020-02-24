import {
  TeamsAction,
  SUCCESS,
  CHANGE_POOL,
  LOAD_DIVISIONS,
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

const teamsReducer = (state: AppState = initialState, action: TeamsAction) => {
  switch (action.type) {
    case LOAD_DIVISIONS + SUCCESS:
      return { ...state, divisions: action.payload };
    case LOAD_POOLS + SUCCESS:
      return { ...state, pools: action.payload };
    case LOAD_TEAMS + SUCCESS:
      return { ...state, teams: action.payload };
    case CHANGE_POOL:
      const changedTeam = action.payload;

      return {
        ...state,
        teams: state.teams.map(team =>
          team.team_id === changedTeam.team_id ? changedTeam : team
        ),
      };
    case EDIT_TEAM + SUCCESS:
      const editedTeam = action.payload as ITeam;

      return {
        ...state,
        teams: state.teams.map(it =>
          it.team_id === editedTeam.team_id ? editedTeam : it
        ),
      };
    case DELETE_TEAM + SUCCESS:
      const removedTeam = action.payload as ITeam;

      return {
        ...state,
        teams: state.teams.filter(it => it.team_id !== removedTeam.team_id),
      };
    default:
      return state;
  }
};

export default teamsReducer;
