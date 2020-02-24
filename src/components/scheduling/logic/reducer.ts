import {
  ScheduleActionType,
  SCHEDULE_FETCH_SUCCESS,
  SCHEDULE_FETCH_FAILURE,
} from './actionTypes';
import { ISchedule } from 'common/models/schedule';

export interface ISchedulingState {
  error: boolean;
  schedule?: ISchedule;
}

const appState: ISchedulingState = {
  error: false,
  schedule: undefined,
};

export default (state = appState, action: ScheduleActionType) => {
  switch (action.type) {
    case SCHEDULE_FETCH_SUCCESS:
      return {
        ...state,
        error: false,
        schedule: action.payload,
      };

    case SCHEDULE_FETCH_FAILURE:
      return {
        ...state,
        error: true,
      };

    default:
      return state;
  }
};
