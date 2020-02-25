import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import { EMPTY_FACILITY, EMPTY_FIELD } from './constants';
import {
  SUCCESS,
  FAILURE,
  ADD_EMPTY_FACILITY,
  ADD_EMPTY_FIELD,
  LOAD_FACILITIES,
  LOAD_FIELDS_START,
  LOAD_FIELDS_SUCCESS,
  LOAD_FIELDS_FAILURE,
  UPDATE_FACILITY,
  UPDATE_FIELD,
  SAVE_FACILITIES,
  FacilitiesAction,
} from './action-types';
import Api from 'api/api';
import { getVarcharEight } from '../../../helpers';
import { IFacility, IField } from '../../../common/models';

const loadFacilities: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);

    dispatch({
      type: LOAD_FACILITIES + SUCCESS,
      payload: facilities,
    });
  } catch {
    dispatch({
      type: LOAD_FACILITIES + FAILURE,
    });
  }
};

const loadFields: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (facilityId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_FIELDS_START,
      payload: {
        facilityId,
      },
    });

    const fields = await Api.get(`/fields?facilities_id=${facilityId}`);

    dispatch({
      type: LOAD_FIELDS_SUCCESS,
      payload: {
        facilityId,
        fields,
      },
    });
  } catch {
    dispatch({
      type: LOAD_FIELDS_FAILURE,
    });
  }
};

const addEmptyFacility = (eventId: string): FacilitiesAction => ({
  type: ADD_EMPTY_FACILITY,
  payload: {
    facility: {
      ...EMPTY_FACILITY,
      facilities_id: getVarcharEight(),
      isNew: true,
      event_id: eventId,
    },
  },
});

const addEmptyField = (facilityId: string): FacilitiesAction => ({
  type: ADD_EMPTY_FIELD,
  payload: {
    field: {
      ...EMPTY_FIELD,
      field_id: getVarcharEight(),
      isNew: true,
      facilities_id: facilityId,
    },
  },
});

const updateFacilities = (updatedFacility: IFacility): FacilitiesAction => ({
  type: UPDATE_FACILITY,
  payload: {
    updatedFacility: { ...updatedFacility, isChange: true },
  },
});

const updateField = (updatedField: IField): FacilitiesAction => ({
  type: UPDATE_FIELD,
  payload: {
    updatedField: { ...updatedField, isChange: true },
  },
});

const saveFacilities: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (facilities: IFacility[], fields: IField[]) => async (
  dispatch: Dispatch
) => {
  try {
    for await (let facility of facilities) {
      delete facility.isFieldsLoaded;
      delete facility.isFieldsLoading;

      if (facility.isChange && !facility.isNew) {
        delete facility.isChange;

        Api.put(
          `/facilities?facilities_id=${facility.facilities_id}`,
          facility
        );
      }

      if (facility.isNew) {
        delete facility.isChange;
        delete facility.isNew;

        Api.post('/facilities', facility);
      }
    }

    for await (let field of fields) {
      if (field.isChange && !field.isNew) {
        delete field.isChange;

        Api.put(`/fields?fields_id=${field.field_id}`, field);
      }

      if (field.isNew) {
        delete field.isChange;
        delete field.isNew;

        Api.post('/fields', field);
      }
    }

    dispatch({
      type: SAVE_FACILITIES + SUCCESS,
    });
  } catch {
    dispatch({
      type: SAVE_FACILITIES + FAILURE,
    });
  }
};

export {
  loadFacilities,
  loadFields,
  addEmptyFacility,
  addEmptyField,
  updateFacilities,
  updateField,
  saveFacilities,
};
