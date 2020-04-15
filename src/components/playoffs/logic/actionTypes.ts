export const PLAYOFF_SAVED_SUCCESS = 'PLAYOFF_SAVED_SUCCESS';

interface IPlayoffSavedSuccess {
  type: 'PLAYOFF_SAVED_SUCCESS';
  payload: boolean;
}

export type IPlayoffAction = IPlayoffSavedSuccess;
