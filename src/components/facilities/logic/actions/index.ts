import {
  EMPTY_FACILITY,
  ADD_EMPTY_FACILITY,
  // SAVE_FACILITIES,
  UPDATE_FACILITY,
} from '../constants/';
import { IFacility } from '../../../../common/models/facilities';

const addEmptyFacility = () => ({
  type: ADD_EMPTY_FACILITY,
  payload: {
    facility: { ...EMPTY_FACILITY, facilities_id: Math.random() },
  },
});

const updateFacilities = (updatedFacility: IFacility) => ({
  type: UPDATE_FACILITY,
  payload: {
    updatedFacility,
  },
});

const saveFacilities = (facilities: IFacility[]) => {
  const savedFacilities = facilities.filter(it => {
    const isChange = it.isChange;

    delete it.isChange;

    return isChange;
  });

  console.log(savedFacilities);
};

export { addEmptyFacility, updateFacilities, saveFacilities };
