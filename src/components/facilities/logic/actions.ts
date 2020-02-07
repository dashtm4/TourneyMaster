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
} from './action-types';
import { FacilitiesAction } from './action-types';
import { IFacility } from '../../../common/models/facilities';
import Api from 'api/api';

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
      facilities_id: `${Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000}`,
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
  const savedFacilities = facilities.filter(it => {
    const isChange = it.isChange;

    delete it.isChange;

    return isChange;
  });

  if (savedFacilities.length === 0) return;

  try {
    for await (let facility of savedFacilities) {
      Api.post('/facilities', facility);
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

export { loadFacilities, addEmptyFacility, updateFacilities, saveFacilities };
