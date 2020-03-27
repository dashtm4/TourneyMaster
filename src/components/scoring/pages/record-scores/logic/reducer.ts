import {
  LOAD_SCORES_DATA_START,
  LOAD_SCORES_DATA_SUCCESS,
  RecordScoresAction,
} from './action-types';
import {
  IDivision,
  ITeam,
  IEventSummary,
  ISchedulesDetails,
  IFacility,
  IEventDetails,
  IField,
  ISchedule,
  IPool,
} from 'common/models';

export interface IRecordScoresState {
  event: IEventDetails | null;
  facilities: IFacility[];
  fields: IField[];
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  schedule: ISchedule | null;
  eventSummary: IEventSummary[];
  schedulesDetails: ISchedulesDetails[];
  isLoading: boolean;
  isLoaded: boolean;
}

const initialState = {
  event: null,
  facilities: [],
  fields: [],
  divisions: [],
  pools: [],
  teams: [],
  schedule: null,
  eventSummary: [],
  schedulesDetails: [],
  isLoading: false,
  isLoaded: false,
};

const recordScoresReducer = (
  state: IRecordScoresState = initialState,
  action: RecordScoresAction
) => {
  switch (action.type) {
    case LOAD_SCORES_DATA_START: {
      return { ...initialState, isLoading: true };
    }
    case LOAD_SCORES_DATA_SUCCESS: {
      const {
        event,
        facilities,
        fields,
        schedule,
        divisions,
        teams,
        eventSummary,
        pools,
        schedulesDetails,
      } = action.payload;

      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        event,
        facilities,
        fields,
        schedule,
        divisions,
        teams,
        eventSummary,
        pools,
        schedulesDetails,
      };
    }

    default:
      return state;
  }
};

export default recordScoresReducer;
