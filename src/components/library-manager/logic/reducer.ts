import {
  LibraryManagerAction,
  LIBRARY_MANAGER_LOAD_DATA_START,
  LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
} from './action-types';
import { IRegistration } from 'common/models/registration';

const initialState = {
  isLoading: false,
  isLoaded: false,
  registrations: [],
};

export interface AppState {
  isLoading: boolean;
  isLoaded: boolean;
  registrations: IRegistration[];
}

const libraryManagerReducer = (
  state: AppState = initialState,
  action: LibraryManagerAction
) => {
  switch (action.type) {
    case LIBRARY_MANAGER_LOAD_DATA_START: {
      return {
        ...initialState,
        isLoading: true,
      };
    }
    case LIBRARY_MANAGER_LOAD_DATA_SUCCESS: {
      const { registrations } = action.payload;

      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        registrations,
      };
    }
    default:
      return state;
  }
};

export default libraryManagerReducer;
