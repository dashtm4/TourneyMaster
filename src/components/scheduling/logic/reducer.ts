import {
  ScheduleActionType,
  SCHEDULE_FETCH_SUCCESS,
  SCHEDULE_FETCH_FAILURE,
  SCHEDULE_FETCH_IN_PROGRESS,
  ADD_NEW_SCHEDULE,
  CHANGE_SCHEDULE,
} from './actionTypes';
import { ISchedule, IConfigurableSchedule } from 'common/models/schedule';

export interface ISchedulingState {
  schedule: IConfigurableSchedule | null;
  schedules: ISchedule[];
  isLoading: boolean;
  isLoaded: boolean;
  error: boolean;
}

const appState: ISchedulingState = {
  schedule: null,
  schedules: [],
  isLoading: false,
  isLoaded: false,
  error: false,
};

export default (state = appState, action: ScheduleActionType) => {
  switch (action.type) {
    case SCHEDULE_FETCH_IN_PROGRESS: {
      return {
        ...appState,
        isLoading: true,
      };
    }
    case SCHEDULE_FETCH_SUCCESS: {
      const { schedules } = action.payload;

      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        schedules,
      };
    }
    case SCHEDULE_FETCH_FAILURE: {
      return {
        ...state,
        error: true,
        schedulingIsLoading: false,
      };
    }
    case ADD_NEW_SCHEDULE: {
      const { newSchedule } = action.payload;

      return {
        ...state,
        schedule: newSchedule,
      };
    }
    case CHANGE_SCHEDULE: {
      const { scheduleKey } = action.payload;

      return {
        ...state,
        schedule: {
          ...state.schedule,
          ...scheduleKey,
        },
      };
    }
    default:
      return state;
  }
};
