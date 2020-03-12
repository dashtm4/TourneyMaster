import { IMember } from 'common/models';

const LOAD_USER_DATA_START = 'UTILITIES:LOAD_USER_DATA_START';
const LOAD_USER_DATA_SUCCESS = 'UTILITIES:LOAD_USER_DATA_SUCCESS';
const LOAD_USER_DATA_FAILURE = 'UTILITIES:LOAD_USER_DATA_FAILURE';

const CHANGE_USER = 'UTILITIES:CHANGE_USER';

interface LoadUserDataStart {
  type: 'UTILITIES:LOAD_USER_DATA_START';
}

interface LoadUserDataSuccess {
  type: 'UTILITIES:LOAD_USER_DATA_SUCCESS';
  payload: {
    userData: IMember;
  };
}

interface changeUser {
  type: 'UTILITIES:CHANGE_USER';
  payload: {
    userNewField: Partial<IMember>;
  };
}

export type UtilitiesAction =
  | LoadUserDataStart
  | LoadUserDataSuccess
  | changeUser;

export {
  LOAD_USER_DATA_START,
  LOAD_USER_DATA_SUCCESS,
  LOAD_USER_DATA_FAILURE,
  CHANGE_USER,
};
