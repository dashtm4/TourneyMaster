import { ITeam } from '../../../common/models/teams';

export const SUCCESS = '_SUCCESS';
export const FAILURE = '_FAILURE';
export const LOAD_TEAMS = 'LOAD_TEAMS';

export interface loadTeamsSuccess {
  type: 'LOAD_TEAMS_SUCCESS';
  payload: {
    teams: ITeam[];
  };
}

export type TeamsAction = loadTeamsSuccess;
