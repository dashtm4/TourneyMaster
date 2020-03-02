import { EventMenu } from './constants';
import {
  LOAD_FACILITIES_SUCCESS,
  FacilitiesAction,
} from 'components/facilities/logic/action-types';
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
  action: FacilitiesAction
) => {
  switch (action.type) {
    case LOAD_FACILITIES_SUCCESS: {
      const { facilities } = action.payload;

      return {
        ...state,
        menuList: state.menuList.map(item =>
          item.title === EventMenuTitles.FACILITIES
            ? {
                ...item,
                children: facilities.map(it => it.facilities_description),
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
