import { IDivision } from 'common/models';

export const DIVISIONS_FETCH_SUCCESS = 'DIVISIONS_FETCH_SUCCESS';
export const DIVISIONS_FETCH_FAILURE = 'DIVISIONS_FETCH_FAILURE';
export const POOLS_FETCH_SUCCESS = 'POOLS_FETCH_SUCCESS';
export const TEAMS_FETCH_SUCCESS = 'TEAMS_FETCH_SUCCESS';
export const FETCH_DETAILS_START = 'FETCH_DETAILS_START';
export const ADD_DIVISION_SUCCESS = 'ADD_DIVISION_SUCCESS';
export const UPDATE_DIVISION_SUCCESS = 'UPDATE_DIVISION_SUCCESS';
export const DELETE_DIVISION_SUCCESS = 'DELETE_DIVISION_SUCCESS';
export const ADD_POOL_SUCCESS = 'ADD_POOL_SUCCESS';
export const REGISTRATION_FETCH_SUCCESS =
  'DIVISIONS_REGISTRATION_FETCH_SUCCESS';
export const DIVISION_SAVE_SUCCESS = 'DIVISION_SAVE_SUCCESS';

export interface loadDivisionsSuccess {
  type: 'DIVISIONS_FETCH_SUCCESS';
  payload: IDivision[];
}

export interface saveDivisionsSuccess {
  type: 'DIVISION_SAVE_SUCCESS';
  payload: IDivision[];
}

export type DivisionsPoolsAction = loadDivisionsSuccess | saveDivisionsSuccess;
