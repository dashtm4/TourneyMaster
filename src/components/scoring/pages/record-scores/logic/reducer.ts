import {
  LOAD_SCORES_DATA_START,
  LOAD_SCORES_DATA_SUCCESS,
  RecordScoresAction,
} from './action-types';
import { IDivision, ITeam, IField } from 'common/models';

const initialState = {
  divisions: [],
  teams: [],
  fields: [],
  isLoading: false,
  isLoaded: false,
};

export interface AppState {
  divisions: IDivision[];
  teams: ITeam[];
  fields: IField[];
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
      const { divisions, teams, fields } = action.payload;

      return {
        ...state,
        divisions,
        teams,
        fields,
        isLoading: false,
        isLoaded: true,
      };
    }

    default:
      return state;
  }
};

export default recordScoresReducer;
