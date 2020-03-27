import {
  IScheduleAction,
  FETCH_EVENT_SUMMARY_SUCCESS,
  FETCH_EVENT_SUMMARY_FAILURE,
  SCHEDULES_DRAFT_SAVED_SUCCESS,
  SCHEDULES_SAVING_IN_PROGRESS,
  SCHEDULES_DRAFT_SAVED_FAILURE,
  FETCH_SCHEDULES_DETAILS_SUCCESS,
  FETCH_SCHEDULES_DETAILS_FAILURE,
} from './actionTypes';
import { IEventSummary } from 'common/models/event-summary';
import { ISchedule } from 'common/models';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';

export interface ISchedulesState {
  error: boolean;
  fetchError: boolean;
  draftIsAlreadySaved: boolean;
  savingInProgress: boolean;
  schedule?: ISchedule;
  schedulesDetails?: ISchedulesDetails[];
  eventSummary?: IEventSummary[];
}

const initialState: ISchedulesState = {
  error: false,
  fetchError: false,
  savingInProgress: false,
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
        savingInProgress: false,
        draftIsAlreadySaved: true,
      };
    case SCHEDULES_DRAFT_SAVED_FAILURE:
      return {
        ...state,
        savingInProgress: false,
      };
    case SCHEDULES_SAVING_IN_PROGRESS:
      return {
        ...state,
        savingInProgress: true,
      };
    case FETCH_SCHEDULES_DETAILS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        ...action.payload,
      };
    case FETCH_SCHEDULES_DETAILS_FAILURE:
      return {
        ...state,
        fetchError: true,
      };
    default:
      return state;
  }
};

export default SchedulesReducer;
