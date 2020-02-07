import {
  EMPTY_FACILITY,
  ADD_EMPTY_FACILITY,
  SAVE_FACILITIES,
} from '../constants/';
import { IFacility } from '../../../../common/models/facilities';

const addEmptyFacility = () => ({
  type: ADD_EMPTY_FACILITY,
  payload: {
    facility: { ...EMPTY_FACILITY, facilities_id: Math.random() },
  },
});

const saveFacilities = (facilities: IFacility[]) => ({
  type: SAVE_FACILITIES,
  payload: {
    facility: { facilities },
  },
});

export { addEmptyFacility, saveFacilities };
