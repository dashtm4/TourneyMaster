import {
  LOAD_REPORTING_DATA_START,
  LOAD_REPORTING_DATA_SUCCESS,
  ReportingAction,
} from './action-types';
import {
  IDivision,
  ITeam,
  IFacility,
  IEventDetails,
  IField,
  ISchedule,
  IPool,
  ISchedulesGame,
} from 'common/models';

export interface IReportingState {
  event: IEventDetails | null;
  facilities: IFacility[];
  fields: IField[];
  divisions: IDivision[];
  teams: ITeam[];
  schedule: ISchedule | null;
  schedulesGames: ISchedulesGame[];
  pools: IPool[];
  isLoading: boolean;
  isLoaded: boolean;
}

const initialState = {
  event: null,
  facilities: [],
  fields: [],
  divisions: [],
  teams: [],
  schedulesGames: [],
  pools: [],
  schedule: null,
  isLoading: false,
  isLoaded: false,
};

const reportingReducer = (
  state: IReportingState = initialState,
  action: ReportingAction
) => {
  switch (action.type) {
    case LOAD_REPORTING_DATA_START: {
      return { ...initialState, isLoading: true };
    }
    case LOAD_REPORTING_DATA_SUCCESS: {
      const {
        event,
        facilities,
        fields,
        schedule,
        divisions,
        teams,
        schedulesGames,
        pools,
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
        schedulesGames,
        pools,
      };
    }

    default:
      return state;
  }
};

export default reportingReducer;
