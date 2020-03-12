import { EventMenu } from './constants';
import {
  LOAD_AUTH_PAGE_DATA_START,
  LOAD_AUTH_PAGE_DATA_SUCCESS,
  CLEAR_AUTH_PAGE_DATA,
  PUBLISH_TOURNAMENT_SUCCESS,
  AuthPageAction,
} from './action-types';
import {
  REGISTRATION_UPDATE_SUCCESS,
  RegistrationAction,
} from 'components/registration/registration-edit/logic/actionTypes';
import {
  SAVE_FACILITIES_SUCCESS,
  FacilitiesAction,
} from 'components/facilities/logic/action-types';
import {
  DIVISIONS_FETCH_SUCCESS,
  DivisionsPoolsAction,
} from 'components/divisions-and-pools/logic/actionTypes';
import {
  LOAD_DIVISIONS_TEAMS_SUCCESS,
  SAVE_TEAMS_SUCCESS,
  TeamsAction,
} from 'components/teams/logic/action-types';
import { sortTitleByField } from 'helpers';
import { IMenuItem, ITournamentData } from 'common/models';
import {
  EventMenuTitles,
  EventMenuRegistrationTitles,
  SortByFilesTypes,
} from 'common/enums';

export interface IPageEventState {
  isLoading: boolean;
  isLoaded: boolean;
  menuList: IMenuItem[];
  tournamentData: ITournamentData;
}

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

const pageEventReducer = (
  state: IPageEventState = initialState,
  action:
    | AuthPageAction
    | FacilitiesAction
    | DivisionsPoolsAction
    | RegistrationAction
    | TeamsAction
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
                children: sortTitleByField(
                  facilities,
                  SortByFilesTypes.FACILITIES
                ),
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
                children: sortTitleByField(
                  divisions,
                  SortByFilesTypes.DIVISIONS
                ),
              };
            }
            case EventMenuTitles.TEAMS: {
              return {
                ...item,
                isCompleted:
                  teams.filter(it => it.division_id && it.pool_id).length > 0,
              };
            }
            default:
              return item;
          }
        }),
      };
    }
    case REGISTRATION_UPDATE_SUCCESS: {
      const registration = action.payload;

      return {
        ...state,
        menuList: state.menuList.map(item =>
          item.title === EventMenuTitles.REGISTRATION
            ? {
                ...item,
                isCompleted: Boolean(registration),
                children: registration
                  ? Object.values(EventMenuRegistrationTitles)
                  : [],
              }
            : item
        ),
      };
    }
    case SAVE_FACILITIES_SUCCESS: {
      const { facilities } = action.payload;

      return {
        ...state,
        menuList: state.menuList.map(item =>
          item.title === EventMenuTitles.FACILITIES
            ? {
                ...item,
                isCompleted: facilities.length > 0,
                children: sortTitleByField(
                  facilities,
                  SortByFilesTypes.FACILITIES
                ),
              }
            : item
        ),
      };
    }
    case DIVISIONS_FETCH_SUCCESS: {
      const divisions = action.payload;

      return {
        ...state,
        menuList: state.menuList.map(item =>
          item.title === EventMenuTitles.DIVISIONS_AND_POOLS
            ? {
                ...item,
                isCompleted: divisions.length > 0,
                children: sortTitleByField(
                  divisions,
                  SortByFilesTypes.DIVISIONS
                ),
              }
            : item
        ),
      };
    }
    case LOAD_DIVISIONS_TEAMS_SUCCESS:
    case SAVE_TEAMS_SUCCESS: {
      const { teams } = action.payload;

      return {
        ...state,
        menuList: state.menuList.map(item =>
          item.title === EventMenuTitles.TEAMS
            ? {
                ...item,
                isCompleted:
                  teams.filter(it => it.division_id && it.pool_id).length > 0,
              }
            : item
        ),
      };
    }
    case PUBLISH_TOURNAMENT_SUCCESS: {
      const { event } = action.payload;

      return {
        ...state,
        tournamentData: {
          ...state.tournamentData,
          event,
        },
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
