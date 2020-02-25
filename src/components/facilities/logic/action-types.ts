import { IFacility, IField } from '../../../common/models';

export const SUCCESS = '_SUCCESS';
export const FAILURE = '_FAILURE';

export const LOAD_FACILITIES = 'LOAD_FACILITIES';

export const LOAD_FIELDS_START = 'FACILITIES:LOAD_FIELDS_START';
export const LOAD_FIELDS_SUCCESS = 'FACILITIES:LOAD_FIELDS_SUCCESS';
export const LOAD_FIELDS_FAILURE = 'FACILITIES:LOAD_FIELDS_FAILURE';

export const ADD_EMPTY_FACILITY = 'ADD_EMPTY_FACILITY';

export const ADD_EMPTY_FIELD = 'ADD_EMPTY_FIELD';

export const UPDATE_FACILITY = 'UPDATE_FACILITY';

export const UPDATE_FIELD = 'UPDATE_FIELD';

export const SAVE_FACILITIES = 'SAVE_FACILITIES';

export interface loadFacilitiesSuccess {
  type: 'LOAD_FACILITIES_SUCCESS';
  payload: {
    facilities: IFacility[];
  };
}

export interface loadFieldsStart {
  type: 'FACILITIES:LOAD_FIELDS_START';
  payload: {
    facilityId: string;
  };
}

export interface loadFieldsSuccess {
  type: 'FACILITIES:LOAD_FIELDS_SUCCESS';
  payload: {
    facilityId: string;
    fields: IField[];
  };
}

export interface addEmptyFacility {
  type: 'ADD_EMPTY_FACILITY';
  payload: {
    facility: IFacility;
  };
}

export interface addEmptyField {
  type: 'ADD_EMPTY_FIELD';
  payload: {
    field: IField;
  };
}

export interface updateFacilities {
  type: 'UPDATE_FACILITY';
  payload: {
    updatedFacility: IFacility;
  };
}

export interface updateField {
  type: 'UPDATE_FIELD';
  payload: {
    updatedField: IField;
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
  | loadFieldsStart
  | loadFieldsSuccess
  | addEmptyFacility
  | addEmptyField
  | updateFacilities
  | updateField
  | saveFacilities;
