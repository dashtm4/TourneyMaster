import { IRegistration } from 'common/models';

const LIBRARY_MANAGER_LOAD_DATA_START = 'LIBRARY_MANAGER_LOAD_DATA_START';
const LIBRARY_MANAGER_LOAD_DATA_SUCCESS = 'LIBRARY_MANAGER_LOAD_DATA_SUCCESS';
const LIBRARY_MANAGER_LOAD_DATA_FAILURE = 'LIBRARY_MANAGER_LOAD_DATA_FAILURE';

interface LibraryManagerLoadDataStart {
  type: 'LIBRARY_MANAGER_LOAD_DATA_START';
}

interface LibraryManagerLoadDataSuccess {
  type: 'LIBRARY_MANAGER_LOAD_DATA_SUCCESS';
  payload: {
    registrations: IRegistration[];
  };
}

export type LibraryManagerAction =
  | LibraryManagerLoadDataStart
  | LibraryManagerLoadDataSuccess;

export {
  LIBRARY_MANAGER_LOAD_DATA_START,
  LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
  LIBRARY_MANAGER_LOAD_DATA_FAILURE,
};
