import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import { EMPTY_FACILITY } from './constants';
import {
  SUCCESS,
  FAILURE,
  ADD_EMPTY_FACILITY,
  LOAD_FACILITIES,
  UPDATE_FACILITY,
  SAVE_FACILITIES,
  FacilitiesAction,
} from './action-types';
import Api from 'api/api';
import { getVarcharEight } from '../../../helpers';
import { IFacility } from '../../../common/models/facilities';

const loadFacilities: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = () => async (dispatch: Dispatch) => {
  try {
    const facilities = await Api.get('/facilities');

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

const addEmptyFacility = (): FacilitiesAction => ({
  type: ADD_EMPTY_FACILITY,
  payload: {
    facility: {
      ...EMPTY_FACILITY,
      facilities_id: getVarcharEight(),
      event_id: 'ABC123',
      created_by: '4DC8A780',
    },
  },
});

const updateFacilities = (updatedFacility: IFacility): FacilitiesAction => ({
  type: UPDATE_FACILITY,
  payload: {
    updatedFacility,
  },
});

const saveFacilities: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (facilities: IFacility[]) => async (dispatch: Dispatch) => {
  const editedFacilities = facilities.filter(it => {
    const isChange = it.isChange;

    if (it.isNew) return false;

    delete it.isChange;
    delete it.isNew;

    return isChange;
  });

  const newFacilities = facilities.filter(it => {
    const isNew = it.isNew;

    delete it.isChange;
    delete it.isNew;

    return isNew;
  });

  if (editedFacilities.length === 0 && newFacilities.length === 0) return;

  try {
    for await (let facility of editedFacilities) {
      Api.put(`/facilities?facilities_id=${facility.facilities_id}`, facility);
    }

    for await (let facility of newFacilities) {
      Api.post('/facilities', facility);
    }

    dispatch({
      type: SAVE_FACILITIES + SUCCESS,
    });
  } catch (e) {
    dispatch({
      type: SAVE_FACILITIES + FAILURE,
    });
  }
};

export { loadFacilities, addEmptyFacility, updateFacilities, saveFacilities };
