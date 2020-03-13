import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as Yup from 'yup';
import { Toasts } from 'components/common';
import { EMPTY_FACILITY, EMPTY_FIELD } from './constants';
import {
  ADD_EMPTY_FACILITY,
  ADD_EMPTY_FIELD,
  LOAD_FACILITIES_START,
  LOAD_FACILITIES_SUCCESS,
  LOAD_FACILITIES_FAILURE,
  LOAD_FIELDS_START,
  LOAD_FIELDS_SUCCESS,
  LOAD_FIELDS_FAILURE,
  UPDATE_FACILITY,
  UPDATE_FIELD,
  SAVE_FACILITIES_SUCCESS,
  SAVE_FACILITIES_FAILURE,
  FacilitiesAction,
  UPLOAD_FILE_MAP_SUCCESS,
  UPLOAD_FILE_MAP_FAILURE,
} from './action-types';
import { IAppState } from 'reducers/root-reducer.types';
import Api from 'api/api';
import { facilitySchema, fieldSchema } from 'validations';
import { getVarcharEight, uploadFile } from 'helpers';
import { IFacility, IField, IUploadFile } from 'common/models';

const loadFacilities: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_FACILITIES_START,
    });

    const facilities = await Api.get(`/facilities?event_id=${eventId}`);

    dispatch({
      type: LOAD_FACILITIES_SUCCESS,
      payload: {
        facilities,
      },
    });
  } catch {
    dispatch({
      type: LOAD_FACILITIES_FAILURE,
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

const addEmptyFacility = (eventId: string) => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  const { tournamentData } = getState().pageEvent;

  const emptyFacility = {
    ...EMPTY_FACILITY,
    event_id: eventId,
    facilities_id: getVarcharEight(),
    first_game_time: tournamentData.event?.first_game_time,
    last_game_end: tournamentData.event?.last_game_end,
    isNew: true,
  };

  dispatch({
    type: ADD_EMPTY_FACILITY,
    payload: {
      facility: emptyFacility,
    },
  });
};

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
    await Yup.array()
      .of(facilitySchema)
      .unique(
        facility => facility.facilities_description,
        'Oops. It looks like you already have facilities with the same name. The facility must have a unique name.'
      )
      .validate(facilities);

    await Yup.array()
      .of(fieldSchema)
      .unique(
        field => field.field_name,
        'Oops. It looks like you already have fields with the same name. The field must have a unique name.'
      )
      .validate(fields);

    for await (let facility of facilities) {
      const copiedFacility = { ...facility };

      delete copiedFacility.isFieldsLoaded;
      delete copiedFacility.isFieldsLoading;

      if (copiedFacility.isChange && !copiedFacility.isNew) {
        delete copiedFacility.isChange;

        Api.put(
          `/facilities?facilities_id=${copiedFacility.facilities_id}`,
          copiedFacility
        );
      }
      if (copiedFacility.isNew) {
        delete copiedFacility.isChange;
        delete copiedFacility.isNew;

        Api.post('/facilities', copiedFacility);
      }
    }

    for await (let field of fields) {
      const copiedField = { ...field };

      if (copiedField.isChange && !copiedField.isNew) {
        delete copiedField.isChange;

        Api.put(`/fields?field_id=${copiedField.field_id}`, copiedField);
      }

      if (copiedField.isNew) {
        delete copiedField.isChange;
        delete copiedField.isNew;

        Api.post('/fields', copiedField);
      }
    }

    dispatch({
      type: SAVE_FACILITIES_SUCCESS,
      payload: {
        facilities,
      },
    });

    Toasts.successToast('Facilities saved successfully');
  } catch (err) {
    dispatch({
      type: SAVE_FACILITIES_FAILURE,
    });

    Toasts.errorToast(err.message);
  }
};

const uploadFileMap: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (facility: IFacility, files: IUploadFile[]) => async (
  dispatch: Dispatch
) => {
  if (!files || !files.length) {
    return;
  }

  for await (let file of files) {
    try {
      const uploadedFile = await uploadFile(file);
      const { key } = uploadedFile as Storage;

      dispatch({
        type: UPLOAD_FILE_MAP_SUCCESS,
        payload: {
          facility: { ...facility, isChange: true, field_map_URL: key },
        },
      });

      Toasts.successToast('Map was successfully uploaded');
    } catch (err) {
      dispatch({
        type: UPLOAD_FILE_MAP_FAILURE,
      });

      Toasts.errorToast('Map could not be uploaded');
    }
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
  uploadFileMap,
};
