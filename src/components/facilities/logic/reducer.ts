import {
  LOAD_FACILITIES_START,
  LOAD_FACILITIES_SUCCESS,
  LOAD_FIELDS_START,
  LOAD_FIELDS_SUCCESS,
  ADD_EMPTY_FACILITY,
  ADD_EMPTY_FIELD,
  UPDATE_FACILITY,
  FacilitiesAction,
  UPDATE_FIELD,
  UPLOAD_FILE_MAP_SUCCESS,
  SAVE_FACILITIES_SUCCESS,
} from './action-types';
import { IFacility, IField } from '../../../common/models';

export interface IFacilitiesState {
  isLoading: boolean;
  isLoaded: boolean;
  facilities: IFacility[];
  fields: IField[];
}

const initialState = {
  isLoading: false,
  isLoaded: false,
  facilities: [],
  fields: [],
};

const facilitiesReducer = (
  state: IFacilitiesState = initialState,
  action: FacilitiesAction
) => {
  switch (action.type) {
    case LOAD_FACILITIES_START: {
      return { ...initialState, isLoading: true };
    }
    case LOAD_FACILITIES_SUCCESS:
      const { facilities } = action.payload;

      return {
        ...state,
        facilities,
        isLoading: false,
        isLoaded: true,
      };
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
    case UPLOAD_FILE_MAP_SUCCESS: {
      const { facility } = action.payload;

      return {
        ...state,
        facilities: state.facilities.map(it =>
          it.facilities_id === facility.facilities_id ? facility : it
        ),
      };
    }
    case SAVE_FACILITIES_SUCCESS: {
      const { facilities } = action.payload;

      return {
        ...state,
        facilities: [
          ...state.facilities,
          ...facilities.filter(fac => !state.facilities.includes(fac)),
        ],
      };
    }
    default:
      return state;
  }
};

export default facilitiesReducer;
