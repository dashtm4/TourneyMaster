import { ILibraryManagerRegistration } from '../common';
import { IEventDetails, IFacility, IDivision } from 'common/models';

const LIBRARY_MANAGER_LOAD_DATA_START = 'LIBRARY_MANAGER_LOAD_DATA_START';
const LIBRARY_MANAGER_LOAD_DATA_SUCCESS = 'LIBRARY_MANAGER_LOAD_DATA_SUCCESS';
const LIBRARY_MANAGER_LOAD_DATA_FAILURE = 'LIBRARY_MANAGER_LOAD_DATA_FAILURE';

const SAVE_SHARED_ITEM_SUCCESS = 'SAVE_SHARED_ITEM_SUCCESS';
const SAVE_SHARED_ITEM_FAILURE = 'SAVE_SHARED_ITEM_FAILURE';

interface LibraryManagerLoadDataStart {
  type: 'LIBRARY_MANAGER_LOAD_DATA_START';
}

interface LibraryManagerLoadDataSuccess {
  type: 'LIBRARY_MANAGER_LOAD_DATA_SUCCESS';
  payload: {
    events: IEventDetails[];
    registrations: ILibraryManagerRegistration[];
    facilities: IFacility[];
    divisions: IDivision[];
  };
}

export type LibraryManagerAction =
  | LibraryManagerLoadDataStart
  | LibraryManagerLoadDataSuccess;

export {
  LIBRARY_MANAGER_LOAD_DATA_START,
  LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
  LIBRARY_MANAGER_LOAD_DATA_FAILURE,
  SAVE_SHARED_ITEM_SUCCESS,
  SAVE_SHARED_ITEM_FAILURE,
};
