import { EventMenu } from './constants';
import {
  LOAD_AUTH_PAGE_DATA_START,
  LOAD_AUTH_PAGE_DATA_SUCCESS,
  CLEAR_AUTH_PAGE_DATA,
  authPageAction,
} from './action-types';
import {
  LOAD_FACILITIES_SUCCESS,
  SAVE_FACILITIES_SUCCESS,
  FacilitiesAction,
} from 'components/facilities/logic/action-types';
import {
  DIVISIONS_FETCH_SUCCESS,
  divisionsPoolsAction,
} from 'components/divisions-and-pools/logic/actionTypes';
import { sortByField } from 'helpers';
import { IMenuItem, ITournamentData } from 'common/models';
import {
  EventMenuTitles,
  EventMenuRegistrationTitles,
  SortByFilesTypes,
} from 'common/enums';

const initialState = {
  isLoading: false,
  isLoaded: false,
  menuList: EventMenu,
  tournamentData: {
    event: null,
    registration: null,
    facilities: [],
    divisions: [],
    teams: [],
  },
};

export interface AppState {
  isLoading: boolean;
  isLoaded: boolean;
  menuList: IMenuItem[];
  tournamentData: ITournamentData;
}

const pageEventReducer = (
  state: AppState = initialState,
  action: authPageAction | FacilitiesAction | divisionsPoolsAction
) => {
  switch (action.type) {
    case LOAD_AUTH_PAGE_DATA_START: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case LOAD_AUTH_PAGE_DATA_SUCCESS: {
      const { tournamentData } = action.payload;
      const {
        event,
        registration,
        facilities,
        divisions,
        teams,
      } = tournamentData;

      return {
        ...state,
        tournamentData,
        isLoaded: true,
        isLoading: false,
        menuList: state.menuList.map(item => {
          switch (item.title) {
            case EventMenuTitles.EVENT_DETAILS: {
              return {
                ...item,
                isCompleted: Boolean(event),
              };
            }
            case EventMenuTitles.FACILITIES: {
              return {
                ...item,
                isCompleted: facilities.length > 0,
                children: sortByField(facilities, SortByFilesTypes.FACILITIES),
              };
            }
            case EventMenuTitles.REGISTRATION: {
              return {
                ...item,
                isCompleted: Boolean(registration),
                children: registration
                  ? Object.values(EventMenuRegistrationTitles)
                  : [],
              };
            }
            case EventMenuTitles.DIVISIONS_AND_POOLS: {
              return {
                ...item,
                isCompleted: divisions.length > 0,
                children: sortByField(divisions, SortByFilesTypes.DIVISIONS),
              };
            }
            case EventMenuTitles.TEAMS: {
              return {
                ...item,
                isCompleted: teams.length > 0,
              };
            }
            default:
              return item;
          }
        }),
      };
    }
    case LOAD_FACILITIES_SUCCESS:
    case SAVE_FACILITIES_SUCCESS: {
      const { facilities } = action.payload;

      return {
        ...state,
        menuList: state.menuList.map(item =>
          item.title === EventMenuTitles.FACILITIES
            ? {
                ...item,
                children: sortByField(facilities, SortByFilesTypes.FACILITIES),
              }
            : item
        ),
      };
    }
    case DIVISIONS_FETCH_SUCCESS: {
      return {
        ...state,
        menuList: state.menuList.map(item =>
          item.title === EventMenuTitles.DIVISIONS_AND_POOLS
            ? {
                ...item,
                children: sortByField(
                  action.payload,
                  SortByFilesTypes.FACILITIES
                ),
              }
            : item
        ),
      };
    }
    case CLEAR_AUTH_PAGE_DATA: {
      return { ...initialState };
    }
    default:
      return state;
  }
};

export default pageEventReducer;
