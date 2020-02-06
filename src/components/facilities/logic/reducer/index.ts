import {
  ADD_EMPTY_FACILITY,
  SAVE_FACILITIES,
  UPDATE_FACILITY,
} from '../constants';
import { IFacility } from '../../../../common/models/facilities';
import { mockedFacilities } from '../../mocks/facilities';

const initialState = {
  facilities: [...mockedFacilities],
};

export interface AppState {
  facilities: IFacility[];
}

const facilitiesReducer = (state: AppState = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_EMPTY_FACILITY:
      return { ...state, facilities: [...state.facilities, payload.facility] };
    case UPDATE_FACILITY: {
      const { updatedFacility } = payload;

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
      return { ...state, facilities: payload.facilities };
  }

  return state;
};

export default facilitiesReducer;
