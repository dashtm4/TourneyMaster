import { EventMenu } from './constants';
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
  menuList: EventMenu,
};

export interface AppState {
  menuList: MenuItem[];
}

const pageEventReducer = (
  state: AppState = initialState,
  action: FacilitiesAction | divisionsPoolsAction
) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default pageEventReducer;
