import { IFacility } from '../../../common/models/facilities';

export const SUCCESS = '_SUCCESS';
export const FAILURE = '_FAILURE';
export const LOAD_FACILITIES = 'LOAD_FACILITIES';
export const ADD_EMPTY_FACILITY = 'ADD_EMPTY_FACILITY';
export const UPDATE_FACILITY = 'UPDATE_FACILITY';
export const SAVE_FACILITIES = 'SAVE_FACILITIES';

export interface loadFacilitiesSuccess {
  type: 'LOAD_FACILITIES_SUCCESS';
  payload: {
    facilities: IFacility[];
  };
}

export interface addEmptyFacility {
  type: 'ADD_EMPTY_FACILITY';
  payload: {
    facility: IFacility;
  };
}

export interface updateFacilities {
  type: 'UPDATE_FACILITY';
  payload: {
    updatedFacility: IFacility;
  };
}

export interface saveFacilities {
  type: 'SAVE_FACILITIES';
  payload: {
    facilities: IFacility[];
  };
}

export type FacilitiesAction =
  | loadFacilitiesSuccess
  | addEmptyFacility
  | updateFacilities
  | saveFacilities;
