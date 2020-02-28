import { ITeam, IPool, IDivision } from '../../../common/models';

export const LOAD_DIVISION_START = 'SCORING:LOAD_DIVISION_START';
export const LOAD_DIVISION_SUCCESS = 'SCORING:LOAD_DIVISION_SUCCESS';
export const LOAD_DIVISION_FAILURE = 'SCORING:LOAD_DIVISION_FAILURE';

export const LOAD_POOLS_START = 'SCORING:LOAD_POOLS_START';
export const LOAD_POOLS_SUCCESS = 'SCORING:LOAD_POOLS_SUCCESS';
export const LOAD_POOLS_FAILURE = 'SCORING:LOAD_POOLS_FAILURE';

export const LOAD_TEAMS_START = 'SCORING:LOAD_TEAMS_START';
export const LOAD_TEAMS_SUCCESS = 'SCORING:LOAD_TEAMS_SUCCESS';
export const LOAD_TEAMS_FAILURE = 'SCORING:LOAD_TEAMS_FAILURE';

export const EDIT_TEAM_SUCCESS = 'SCORING:EDIT_TEAM_SUCCESS';
export const EDIT_TEAM_FAILURE = 'SCORING:EDIT_TEAM_FAILURE';

export const DELETE_TEAM_SUCCESS = 'SCORING:DELETE_TEAM_SUCCESS';
export const DELETE_TEAM_FAILURE = 'SCORING:DELETE_TEAM_FAILURE';

export interface loadDivisionStart {
  type: 'SCORING:LOAD_DIVISION_START';
}

export interface loadDivisionSuccess {
  type: 'SCORING:LOAD_DIVISION_SUCCESS';
  payload: {
    divisions: IDivision[];
  };
}

export interface loadPoolsStart {
  type: 'SCORING:LOAD_POOLS_START';
  payload: {
    divisionId: string;
  };
}

export interface loadPoolsSuccess {
  type: 'SCORING:LOAD_POOLS_SUCCESS';
  payload: {
    divisionId: string;
    pools: IPool[];
  };
}

export interface loadTeamsStart {
  type: 'SCORING:LOAD_TEAMS_START';
  payload: {
    poolId: string,
  };
}

export interface loadTeamsSuccess {
  type: 'SCORING:LOAD_TEAMS_SUCCESS';
  payload: {
    poolId: string,
    teams: ITeam[];
  };
}

export interface editTeamsSuccess {
  type: 'SCORING:EDIT_TEAM_SUCCESS';
  payload: {
    team: ITeam;
  };
}

export interface deleteTeamSuccess {
  type: 'SCORING:DELETE_TEAM_SUCCESS';
  payload: {
    teamId: string;
  };
}

export type TeamsAction =
  | loadTeamsStart
  | loadPoolsStart
  | loadDivisionStart
  | loadDivisionSuccess
  | loadPoolsSuccess
  | loadTeamsSuccess
  | editTeamsSuccess
  | deleteTeamSuccess;
