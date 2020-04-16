import {
  PLAYOFF_SAVED_SUCCESS,
  IPlayoffAction,
  PLAYOFF_FETCH_GAMES,
  PLAYOFF_CLEAR_GAMES,
} from './actionTypes';
import { IBracketGame } from '../bracketGames';

export interface IPlayoffState {
  playoffSaved: boolean;
  bracketGames: IBracketGame[] | null;
}

const defaultState: IPlayoffState = {
  playoffSaved: false,
  bracketGames: null,
};

export default (state = defaultState, action: IPlayoffAction) => {
  switch (action.type) {
    case PLAYOFF_SAVED_SUCCESS:
      return {
        ...state,
        playoffSaved: action.payload,
      };
    case PLAYOFF_FETCH_GAMES:
      return {
        ...state,
        bracketGames: action.payload,
      };
    case PLAYOFF_CLEAR_GAMES:
      return {
        ...state,
        bracketGames: null,
      };
    default:
      return state;
  }
};
