import { ITeam, IPool, IDisision } from '../../../common/models';

export const SUCCESS = '_SUCCESS';
export const FAILURE = '_FAILURE';
export const LOAD_DIVISION = 'LOAD_DIVISION';
export const LOAD_POOLS = 'LOAD_POOLS';
export const LOAD_TEAMS = 'LOAD_TEAMS';
export const EDIT_TEAM = 'EDIT_TEAM';
export const DELETE_TEAM = 'DELETE_TEAM';

export interface loadDivisionSuccess {
  type: 'LOAD_DIVISION_SUCCESS';
  payload: IDisision[];
}

export interface loadPoolsSuccess {
  type: 'LOAD_POOLS_SUCCESS';
  payload: IPool[];
}

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
  | loadDivisionSuccess
  | loadPoolsSuccess
  | loadTeamsSuccess
  | editTeamsSuccess
  | deleteTeamSuccess;
