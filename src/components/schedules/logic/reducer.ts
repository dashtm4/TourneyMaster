import {
  IScheduleAction,
  FETCH_EVENT_SUMMARY_SUCCESS,
  FETCH_EVENT_SUMMARY_FAILURE,
} from './actionTypes';
import { IEventSummary } from 'common/models/event-summary';

export interface ISchedulesState {
  error: boolean;
  eventSummary?: IEventSummary[];
}

const initialState: ISchedulesState = {
  error: false,
};

const SchedulesReducer = (state = initialState, action: IScheduleAction) => {
  switch (action.type) {
    case FETCH_EVENT_SUMMARY_SUCCESS:
      return {
        ...state,
        error: false,
        eventSummary: action.payload,
      };
    case FETCH_EVENT_SUMMARY_FAILURE:
      return {
        ...state,
        error: true,
      };
    default:
      return state;
  }
};

export default SchedulesReducer;
