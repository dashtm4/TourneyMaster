import { EMPTY_FACILITY, ADD_EMPTY_FACILITY } from '../constants/';

const addEmptyFacility = () => ({
  type: ADD_EMPTY_FACILITY,
  payload: {
    facility: { ...EMPTY_FACILITY, facilities_id: Math.random() },
  },
});

export { addEmptyFacility };
