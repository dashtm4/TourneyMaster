import { IField } from 'common/models';
import { IEventSummary } from 'common/models/event-summary';

export const FETCH_FIELDS_SUCCESS = 'FETCH_FIELDS_SUCCESS';
export const FETCH_FIELDS_FAILURE = 'FETCH_FIELDS_FAILURE';
export const FETCH_EVENT_SUMMARY_SUCCESS = 'FETCH_EVENT_SUMMARY_SUCCESS';
export const FETCH_EVENT_SUMMARY_FAILURE = 'FETCH_EVENT_SUMMARY_FAILURE';

export const SCHEDULES_DRAFT_SAVED_SUCCESS = 'SCHEDULES_DRAFT_SAVED_SUCCESS';
export const SCHEDULES_DRAFT_SAVED_FAILURE = 'SCHEDULES_DRAFT_SAVED_FAILURE';

interface IFetchFieldsSuccess {
  type: 'FETCH_FIELDS_SUCCESS';
  payload: IField[];
}

interface IFetchFieldsFailure {
  type: 'FETCH_FIELDS_FAILURE';
}

interface FetchEventSummarySuccess {
  type: 'FETCH_EVENT_SUMMARY_SUCCESS';
  payload: IEventSummary[];
}

interface FetchEventSummaryFailure {
  type: 'FETCH_EVENT_SUMMARY_FAILURE';
}

interface SchedulesDraftSavedSuccess {
  type: 'SCHEDULES_DRAFT_SAVED_SUCCESS';
}

export type FieldsAction = IFetchFieldsSuccess | IFetchFieldsFailure;

export type IScheduleAction =
  | SchedulesDraftSavedSuccess
  | FetchEventSummarySuccess
  | FetchEventSummaryFailure;
