import { IDisision, IPool, ITeam } from '../../../common/models';

export const LOAD_DIVISIONS_TEAMS_START = 'TEAMS:LOAD_DIVISIONS_TEAMS_START';
export const LOAD_DIVISIONS_TEAMS_SUCCESS =
  'TEAMS:LOAD_DIVISIONS_TEAMS_SUCCESS';
export const LOAD_DIVISIONS_TEAMS_FAILURE =
  'TEAMS:LOAD_DIVISIONS_TEAMS_FAILURE';

export const LOAD_POOLS_START = 'TEAMS:LOAD_POOLS_START';
export const LOAD_POOLS_SUCCESS = 'TEAMS:LOAD_POOLS_SUCCESS';
export const LOAD_POOLS_FAILURE = 'TEAMS:LOAD_POOLS_FAILURE';

export const CHANGE_POOL = 'CHANGE_POOL';

export const DELETE_TEAM_SUCCESS = 'TEAMS:DELETE_TEAM_SUCCESS';
export const DELETE_TEAM_FAILURE = 'TEAMS:DELETE_TEAM_FAILURE';

export const EDIT_TEAM_SUCCESS = 'TEAMS:EDIT_TEAM_SUCCESS';
export const EDIT_TEAM_FAILURE = 'TEAMS:EDIT_TEAM_FAILURE';

export interface changePool {
  type: 'CHANGE_POOL';
  payload: {
    changedTeam: ITeam;
  };
}

export interface loadDivisionsTeamsStart {
  type: 'TEAMS:LOAD_DIVISIONS_TEAMS_START';
}

export interface loadDivisionsTeamsSuccess {
  type: 'TEAMS:LOAD_DIVISIONS_TEAMS_SUCCESS';
  payload: {
    divisions: IDisision[];
    teams: ITeam[];
  };
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

export interface editTeamSuccess {
  type: 'TEAMS:EDIT_TEAM_SUCCESS';
  payload: {
    team: ITeam;
  };
}

export interface deleteTeamSuccess {
  type: 'TEAMS:DELETE_TEAM_SUCCESS';
  payload: {
    team: ITeam;
  };
}

export type TeamsAction =
  | changePool
  | loadDivisionsTeamsStart
  | loadDivisionsTeamsSuccess
  | loadPoolsStart
  | loadPoolsSuccess
  | editTeamSuccess
  | deleteTeamSuccess;
