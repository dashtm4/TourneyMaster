import { TeamsAction, SUCCESS, LOAD_TEAMS, DELETE_TEAM } from './action-types';
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
    case DELETE_TEAM + SUCCESS:
      console.log(action.payload);

      return {
        ...state,
        teams: state.teams.filter(it => it.team_id !== action.payload),
      };
    default:
      return state;
  }
};

export default scoringReducer;
