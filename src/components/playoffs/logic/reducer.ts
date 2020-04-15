import { PLAYOFF_SAVED_SUCCESS, IPlayoffAction } from './actionTypes';

export interface IPlayoffState {
  playoffSaved: boolean;
}

const defaultState: IPlayoffState = {
  playoffSaved: false,
};

export default (state = defaultState, action: IPlayoffAction) => {
  switch (action.type) {
    case PLAYOFF_SAVED_SUCCESS:
      return {
        ...state,
        playoffSaved: action.payload,
      };
    default:
      return state;
  }
};
