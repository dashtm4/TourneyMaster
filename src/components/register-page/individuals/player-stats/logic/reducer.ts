import {
  LOAD_REGISTRANT_DATA_START,
  LOAD_REGISTRANT_DATA_SUCCESS,
  LOAD_REGISTRANT_DATA_FAIL,
  PlayerStatsAction,
} from './action-types';

const initialState = {
  registrantDataFields: [],
  isLoading: false,
};

export interface IPlayerStatsState {
  registrantDataFields: any;
}

const playerStatsReducer = (
  state: IPlayerStatsState = initialState,
  action: PlayerStatsAction
) => {
  switch (action.type) {
    case LOAD_REGISTRANT_DATA_START:
      return {
        ...state,
        isLoading: true,
      };
    case LOAD_REGISTRANT_DATA_SUCCESS:
      const { registrantDataFields } = action.payload;
      return {
        ...state,
        registrantDataFields,
        isLoading: false,
      };
    case LOAD_REGISTRANT_DATA_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default playerStatsReducer;
