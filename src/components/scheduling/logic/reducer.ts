import {
  ScheduleActionType,
  SCHEDULE_FETCH_SUCCESS,
  SCHEDULE_FETCH_FAILURE,
  SCHEDULE_FETCH_IN_PROGRESS,
} from './actionTypes';
import { ISchedule } from 'common/models/schedule';

export interface ISchedulingState {
  error: boolean;
  schedule?: ISchedule;
  schedulingIsLoading: boolean;
}

const appState: ISchedulingState = {
  error: false,
  schedule: undefined,
  schedulingIsLoading: false,
};

export default (state = appState, action: ScheduleActionType) => {
  switch (action.type) {
    case SCHEDULE_FETCH_IN_PROGRESS: {
      return {
        ...state,
        schedulingIsLoading: true,
      };
    }
    case SCHEDULE_FETCH_SUCCESS:
      return {
        ...state,
        error: false,
        schedule: action.payload,
        schedulingIsLoading: false,
      };

    case SCHEDULE_FETCH_FAILURE:
      return {
        ...state,
        error: true,
        schedulingIsLoading: false,
      };

    default:
      return state;
  }
};
