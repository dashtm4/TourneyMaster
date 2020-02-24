import { IDisision, IPool, ITeam } from '../../../common/models';

export const SUCCESS = '_SUCCESS';
export const FAILURE = '_FAILURE';
export const LOAD_DIVISIONS = 'LOAD_DIVISIONS';
export const LOAD_POOLS = 'LOAD_POOLS';
export const LOAD_TEAMS = 'LOAD_TEAMS';
export const CHANGE_POOL = 'CHANGE_POOL';
export const DELETE_TEAM = 'DELETE_TEAM';
export const EDIT_TEAM = 'EDIT_TEAM';

export interface changePool {
  type: 'CHANGE_POOL';
  payload: ITeam;
}

export interface loadDivisionsSuccess {
  type: 'LOAD_DIVISIONS_SUCCESS';
  payload: IDisision[];
}

export interface loadPoolsSuccess {
  type: 'LOAD_POOLS_SUCCESS';
  payload: IPool[];
}

export interface loadTeamsSuccess {
  type: 'LOAD_TEAM_SUCCESS';
  payload: ITeam[];
}

export interface editTeamSuccess {
  type: 'EDIT_TEAM_SUCCESS';
  payload: ITeam;
}

export interface deleteTeamSuccess {
  type: 'DELETE_TEAM_SUCCESS';
  payload: ITeam;
}

export type TeamsAction =
  | loadDivisionsSuccess
  | loadPoolsSuccess
  | loadTeamsSuccess
  | changePool
  | deleteTeamSuccess;
