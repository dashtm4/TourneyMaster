import {
  LibraryManagerAction,
  LIBRARY_MANAGER_LOAD_DATA_START,
  LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
} from './action-types';
import { ILibraryManagerRegistration } from '../common';
import { IEventDetails, IFacility } from 'common/models';

export interface ILibraryManagerState {
  isLoading: boolean;
  isLoaded: boolean;
  events: IEventDetails[];
  registrations: ILibraryManagerRegistration[];
  facilities: IFacility[];
}

const initialState = {
  isLoading: false,
  isLoaded: false,
  events: [],
  registrations: [],
  facilities: [],
};

const libraryManagerReducer = (
  state: ILibraryManagerState = initialState,
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
      const { events, registrations, facilities } = action.payload;

      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        events,
        registrations,
        facilities,
      };
    }
    default:
      return state;
  }
};

export default libraryManagerReducer;
