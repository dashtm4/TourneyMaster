import {
  SUCCESS,
  LOAD_FACILITIES,
  ADD_EMPTY_FACILITY,
  SAVE_FACILITIES,
  UPDATE_FACILITY,
  FacilitiesAction,
} from './action-types';
import { IFacility } from '../../../common/models/facilities';

const initialState = {
  facilities: [],
};

export interface AppState {
  facilities: IFacility[];
}

const facilitiesReducer = (
  state: AppState = initialState,
  action: FacilitiesAction
) => {
  switch (action.type) {
    case LOAD_FACILITIES + SUCCESS:
      return { ...state, facilities: action.payload };
    case ADD_EMPTY_FACILITY:
      return {
        ...state,
        facilities: [...state.facilities, action.payload.facility],
      };
    case UPDATE_FACILITY: {
      const { updatedFacility } = action.payload;

      return {
        ...state,
        facilities: state.facilities.map(it =>
          it.facilities_id === updatedFacility.facilities_id
            ? updatedFacility
            : it
        ),
      };
    }
    case SAVE_FACILITIES:
      return state;
    default:
      return state;
  }
};

export default facilitiesReducer;
