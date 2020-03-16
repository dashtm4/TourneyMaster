import {
  LOAD_SCORES_DATA_START,
  LOAD_SCORES_DATA_SUCCESS,
  RecordScoresAction,
} from './action-types';
import { IDivision, ITeam, IEventSummary } from 'common/models';

const initialState = {
  divisions: [],
  teams: [],
  eventSummary: [],
  isLoading: false,
  isLoaded: false,
};

export interface AppState {
  divisions: IDivision[];
  teams: ITeam[];
  eventSummary: IEventSummary[];
  isLoading: boolean;
  isLoaded: boolean;
}

const recordScoresReducer = (
  state: AppState = initialState,
  action: RecordScoresAction
) => {
  switch (action.type) {
    case LOAD_SCORES_DATA_START: {
      return { ...initialState, isLoading: true };
    }
    case LOAD_SCORES_DATA_SUCCESS: {
      const { divisions, teams, eventSummary } = action.payload;

      return {
        ...state,
        divisions,
        teams,
        eventSummary,
        isLoading: false,
        isLoaded: true,
      };
    }

    default:
      return state;
  }
};

export default recordScoresReducer;
