import { ITeam } from '../../../common/models/teams';

export const SUCCESS = '_SUCCESS';
export const FAILURE = '_FAILURE';
export const LOAD_TEAMS = 'LOAD_TEAMS';
export const EDIT_TEAM = 'EDIT_TEAM';
export const DELETE_TEAM = 'DELETE_TEAM';

export interface loadTeamsSuccess {
  type: 'LOAD_TEAMS_SUCCESS';
  payload: ITeam[];
}

export interface editTeamsSuccess {
  type: 'EDIT_TEAM_SUCCESS';
  payload: ITeam;
}

export interface deleteTeamSuccess {
  type: 'DELETE_TEAM_SUCCESS';
  payload: string;
}

export type TeamsAction =
  | loadTeamsSuccess
  | editTeamsSuccess
  | deleteTeamSuccess;
