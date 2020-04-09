import {
  LibraryManagerAction,
  LIBRARY_MANAGER_LOAD_DATA_START,
  LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
  SAVE_SHARED_ITEM_SUCCESS,
} from './action-types';
import { ILibraryManagerRegistration } from '../common';
import { IEventDetails, IFacility, IDivision, ISchedule } from 'common/models';
import { EntryPoints } from 'common/enums';

export interface ILibraryManagerState {
  isLoading: boolean;
  isLoaded: boolean;
  events: IEventDetails[];
  registrations: ILibraryManagerRegistration[];
  facilities: IFacility[];
  divisions: IDivision[];
  schedules: ISchedule[];
}

const initialState = {
  isLoading: false,
  isLoaded: false,
  events: [],
  registrations: [],
  facilities: [],
  divisions: [],
  schedules: [],
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
      const {
        events,
        registrations,
        facilities,
        divisions,
        schedules,
      } = action.payload;

      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        events,
        registrations,
        facilities,
        divisions,
        schedules,
      };
    }
    case SAVE_SHARED_ITEM_SUCCESS: {
      const { sharedItem, entryPoint } = action.payload;

      switch (entryPoint) {
        case EntryPoints.EVENTS: {
          return {
            ...state,
            events: [...state.events, sharedItem],
          };
        }
        case EntryPoints.REGISTRATIONS: {
          return {
            ...state,
            registrations: [...state.registrations, sharedItem],
          };
        }
        case EntryPoints.FACILITIES: {
          return {
            ...state,
            facilities: [...state.facilities, sharedItem],
          };
        }
        case EntryPoints.DIVISIONS: {
          return {
            ...state,
            divisions: [...state.divisions, sharedItem],
          };
        }
        case EntryPoints.SCHEDULES: {
          return {
            ...state,
            schedules: [...state.schedules, sharedItem],
          };
        }
      }
    }
    default:
      return state;
  }
};

export default libraryManagerReducer;
