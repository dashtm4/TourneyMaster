import { IDisision, IPool, ITeam } from '../../../common/models';

export const SUCCESS = '_SUCCESS';
export const FAILURE = '_FAILURE';
export const LOAD_DIVISIONS = 'LOAD_DIVISIONS';
export const LOAD_POOLS_START = 'TEAMS:LOAD_POOLS_START';
export const LOAD_POOLS_SUCCESS = 'TEAMS:LOAD_POOLS_SUCCESS';
export const LOAD_POOLS_FAILURE = 'TEAMS:LOAD_POOLS_FAILURE';
export const LOAD_TEAMS_START = 'TEAMS:LOAD_TEAMS_START';
export const LOAD_TEAMS_SUCCESS = 'TEAMS:LOAD_TEAMS_SUCCESS';
export const LOAD_TEAMS_FAILURE = 'TEAMS:LOAD_TEAMS_FAILURE';
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

export interface loadPoolsStart {
  type: 'TEAMS:LOAD_POOLS_START';
  payload: {
    divisionId: string;
  };
}

export interface loadPoolsSuccess {
  type: 'TEAMS:LOAD_POOLS_SUCCESS';
  payload: {
    divisionId: string;
    pools: IPool[];
  };
}

export interface loadTeamsStart {
  type: 'TEAMS:LOAD_TEAMS_START';
  payload: {
    poolId: string;
  };
}

export interface loadTeamsSuccess {
  type: 'TEAMS:LOAD_TEAMS_SUCCESS';
  payload: {
    poolId: string;
    teams: ITeam[];
  };
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
  | loadPoolsStart
  | loadPoolsSuccess
  | loadTeamsStart
  | loadTeamsSuccess
  | changePool
  | deleteTeamSuccess;
