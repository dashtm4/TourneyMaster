import {
  ScheduleActionType,
  SCHEDULE_FETCH_SUCCESS,
  SCHEDULE_FETCH_FAILURE,
  SCHEDULE_FETCH_IN_PROGRESS,
  ADD_NEW_SCHEDULE,
  CHANGE_SCHEDULE,
  UPDATE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_SUCCESS,
  ADD_NEW_BRACKET,
} from './actionTypes';
import { IConfigurableSchedule } from 'common/models/schedule';
import { ISchedulingSchedule } from '../types';
import { IBracket } from 'common/models/playoffs/bracket';

export interface ISchedulingState {
  schedule: IConfigurableSchedule | null;
  schedules: ISchedulingSchedule[];
  isLoading: boolean;
  isLoaded: boolean;
  error: boolean;
  bracket: IBracket | null;
}

const appState: ISchedulingState = {
  schedule: null,
  schedules: [],
  isLoading: false,
  isLoaded: false,
  error: false,
  bracket: null,
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
    case UPDATE_SCHEDULE_SUCCESS: {
      const { schedule } = action.payload;

      return {
        ...state,
        schedules: state.schedules.map(it =>
          it.schedule_id === schedule.schedule_id ? schedule : it
        ),
      };
    }
    case DELETE_SCHEDULE_SUCCESS: {
      const { schedule } = action.payload;

      return {
        ...state,
        schedules: state.schedules.filter(
          it => it.schedule_id !== schedule.schedule_id
        ),
      };
    }
    case ADD_NEW_BRACKET:
      return {
        ...state,
        bracket: action.payload,
      };
    default:
      return state;
  }
};
