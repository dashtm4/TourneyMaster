export const LOAD_REGISTRANT_DATA_START = 'REGISTRANT/LOAD_REGISTRANT_DATA_START';
export const LOAD_REGISTRANT_DATA_SUCCESS = 'REGISTRANT/LOAD_REGISTRANT_DATA_SUCCESS';
export const LOAD_REGISTRANT_DATA_FAIL = 'REGISTRANT/LOAD_REGISTRANT_DATA_FAIL';

export interface loadRegistrantDataStart {
  type: 'REGISTRANT/LOAD_REGISTRANT_DATA_START',
}

export interface loadRegistrantDataSuccess {
  type: 'REGISTRANT/LOAD_REGISTRANT_DATA_SUCCESS',
  payload: {
    registrantDataFields: any,
  },
}

export interface loadRegistrantDataFail {
  type: 'REGISTRANT/LOAD_REGISTRANT_DATA_FAIL',
}

export type PlayerStatsAction =
  | loadRegistrantDataStart
  | loadRegistrantDataSuccess
  | loadRegistrantDataFail;
