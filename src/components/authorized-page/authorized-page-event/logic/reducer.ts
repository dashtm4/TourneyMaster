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
import { MenuItem } from 'common/models';
import { EventMenuTitles } from 'common/enums';

const initialState = {
  isLoading: false,
  isLoaded: false,
  menuList: EventMenu,
};

export interface AppState {
  isLoading: boolean;
  isLoaded: boolean;
  menuList: MenuItem[];
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
      const { facilities, divisions } = action.payload;

      return {
        ...state,
        isLoaded: true,
        isLoading: false,
        menuList: state.menuList.map(item => {
          switch (item.title) {
            case EventMenuTitles.FACILITIES: {
              return {
                ...item,
                children: facilities
                  .sort((a, b) =>
                    a.facilities_description > b.facilities_description ? 1 : -1
                  )
                  .map(it => it.facilities_description),
              };
            }
            case EventMenuTitles.DIVISIONS_AND_POOLS: {
              return {
                ...item,
                children: divisions
                  .sort((a, b) => (a.short_name > b.short_name ? 1 : -1))
                  .map(it => it.short_name),
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
                children: facilities
                  .sort((a, b) =>
                    a.facilities_description > b.facilities_description ? 1 : -1
                  )
                  .map(it => it.facilities_description),
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
                children: action.payload
                  .sort((a, b) => (a.short_name > b.short_name ? 1 : -1))
                  .map(it => it.short_name),
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
