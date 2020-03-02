import { IDivision, ITeam, IField } from 'common/models';

export const LOAD_SCORES_DATA_START = 'RECORD_SCORES:LOAD_SCORES_DATA_START';

export const LOAD_SCORES_DATA_SUCCESS =
  'SRECORD_SCORES:LOAD_SCORES_DATA_SUCCESS';

export const LOAD_SCORES_DATA_FAILURE =
  'RECORD_SCORES:LOAD_SCORES_DATA_FAILURE';

export interface loadScoresDataStart {
  type: 'RECORD_SCORES:LOAD_SCORES_DATA_START';
}

export interface loadScoresDataSuccess {
  type: 'SRECORD_SCORES:LOAD_SCORES_DATA_SUCCESS';
  payload: {
    divisions: IDivision[];
    teams: ITeam[];
    fields: IField[];
  };
}

export type RecordScoresAction = loadScoresDataStart | loadScoresDataSuccess;