import {
  SUCCESS,
  LOAD_FACILITIES,
  LOAD_FIELDS_START,
  LOAD_FIELDS_SUCCESS,
  ADD_EMPTY_FACILITY,
  ADD_EMPTY_FIELD,
  SAVE_FACILITIES,
  UPDATE_FACILITY,
  FacilitiesAction,
  UPDATE_FIELD,
} from './action-types';
import { IFacility, IField } from '../../../common/models';

const initialState = {
  facilities: [],
  fields: [],
};

export interface AppState {
  facilities: IFacility[];
  fields: IField[];
}

const facilitiesReducer = (
  state: AppState = initialState,
  action: FacilitiesAction
) => {
  switch (action.type) {
    case LOAD_FACILITIES + SUCCESS:
      return { ...state, facilities: action.payload };
    case LOAD_FIELDS_START: {
      const { facilityId } = action.payload;

      return {
        ...state,
        facilities: state.facilities.map(it =>
          it.facilities_id === facilityId
            ? { ...it, isFieldsLoading: true }
            : it
        ),
      };
    }
    case LOAD_FIELDS_SUCCESS: {
      const { facilityId, fields } = action.payload;

      return {
        ...state,
        facilities: state.facilities.map(it =>
          it.facilities_id === facilityId
            ? { ...it, isFieldsLoading: false, isFieldsLoaded: true }
            : it
        ),
        fields: [...state.fields, ...fields],
      };
    }
    case ADD_EMPTY_FACILITY:
      return {
        ...state,
        facilities: [...state.facilities, action.payload.facility],
      };
    case ADD_EMPTY_FIELD: {
      const { field } = action.payload;

      return {
        ...state,
        fields: [...state.fields, field],
      };
    }
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
    case UPDATE_FIELD: {
      const { updatedField } = action.payload;

      return {
        ...state,
        fields: state.fields.map(it =>
          it.field_id === updatedField.field_id ? updatedField : it
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
