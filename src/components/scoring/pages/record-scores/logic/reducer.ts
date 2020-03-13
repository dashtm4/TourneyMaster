import {
  LOAD_SCORES_DATA_START,
  LOAD_SCORES_DATA_SUCCESS,
  RecordScoresAction,
} from './action-types';
import { IDivision, ITeam, IEventSummary, IField } from 'common/models';

export interface AppState {
  divisions: IDivision[];
  fields: IField[];
  teams: ITeam[];
  eventSummary: IEventSummary[];
  isLoading: boolean;
  isLoaded: boolean;
}

const initialState = {
  divisions: [],
  fields: [],
  teams: [],
  eventSummary: [],
  isLoading: false,
  isLoaded: false,
};

const recordScoresReducer = (
  state: AppState = initialState,
  action: RecordScoresAction
) => {
  switch (action.type) {
    case LOAD_SCORES_DATA_START: {
      return { ...initialState, isLoading: true };
    }
    case LOAD_SCORES_DATA_SUCCESS: {
      const { divisions, teams, fields, eventSummary } = action.payload;

      return {
        ...state,
        divisions,
        fields,
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
