import {
  IScheduleAction,
  FETCH_EVENT_SUMMARY_SUCCESS,
  FETCH_EVENT_SUMMARY_FAILURE,
  SCHEDULES_DRAFT_SAVED_SUCCESS,
} from './actionTypes';
import { IEventSummary } from 'common/models/event-summary';

export interface ISchedulesState {
  error: boolean;
  draftIsAlreadySaved: boolean;
  eventSummary?: IEventSummary[];
}

const initialState: ISchedulesState = {
  error: false,
  draftIsAlreadySaved: false,
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
    case SCHEDULES_DRAFT_SAVED_SUCCESS:
      return {
        ...state,
        draftIsAlreadySaved: true,
      };
    default:
      return state;
  }
};

export default SchedulesReducer;
