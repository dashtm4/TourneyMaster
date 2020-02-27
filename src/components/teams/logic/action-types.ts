import { IDivision, IPool, ITeam } from '../../../common/models';

export const LOAD_DIVISIONS_TEAMS_START = 'TEAMS:LOAD_DIVISIONS_TEAMS_START';
export const LOAD_DIVISIONS_TEAMS_SUCCESS =
  'TEAMS:LOAD_DIVISIONS_TEAMS_SUCCESS';
export const LOAD_DIVISIONS_TEAMS_FAILURE =
  'TEAMS:LOAD_DIVISIONS_TEAMS_FAILURE';

export const LOAD_POOLS_START = 'TEAMS:LOAD_POOLS_START';
export const LOAD_POOLS_SUCCESS = 'TEAMS:LOAD_POOLS_SUCCESS';
export const LOAD_POOLS_FAILURE = 'TEAMS:LOAD_POOLS_FAILURE';

export const SAVE_TEAMS_START = 'TEAMS:SAVE_TEAMS_START';
export const SAVE_TEAMS_SUCCESS = 'TEAMS:SAVE_TEAMS_SUCCESS';
export const SAVE_TEAMS_FAILURE = 'TEAMS:SAVE_TEAMS_FAILURE';

export interface loadDivisionsTeamsStart {
  type: 'TEAMS:LOAD_DIVISIONS_TEAMS_START';
}

export interface loadDivisionsTeamsSuccess {
  type: 'TEAMS:LOAD_DIVISIONS_TEAMS_SUCCESS';
  payload: {
    divisions: IDivision[];
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

export interface saveTeamsSuccess {
  type: 'TEAMS:SAVE_TEAMS_SUCCESS';
  payload: {
    teams: ITeam[];
  };
}

export type TeamsAction =
  | loadDivisionsTeamsStart
  | loadDivisionsTeamsSuccess
  | loadPoolsStart
  | loadPoolsSuccess
  | saveTeamsSuccess;
