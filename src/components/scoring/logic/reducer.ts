import {
  TeamsAction,
  SUCCESS,
  LOAD_TEAMS,
  EDIT_TEAM,
  DELETE_TEAM,
} from './action-types';
import { ITeam } from '../../../common/models/teams';

const initialState = {
  teams: [],
};

export interface AppState {
  teams: ITeam[];
}

const scoringReducer = (
  state: AppState = initialState,
  action: TeamsAction
) => {
  switch (action.type) {
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
