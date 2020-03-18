import { IField } from 'common/models';
import { IEventSummary } from 'common/models/event-summary';

export const FETCH_FIELDS_SUCCESS = 'FETCH_FIELDS_SUCCESS';
export const FETCH_FIELDS_FAILURE = 'FETCH_FIELDS_FAILURE';
export const FETCH_EVENT_SUMMARY_SUCCESS = 'FETCH_EVENT_SUMMARY_SUCCESS';
export const FETCH_EVENT_SUMMARY_FAILURE = 'FETCH_EVENT_SUMMARY_FAILURE';

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

export type FieldsAction = IFetchFieldsSuccess | IFetchFieldsFailure;

export type IScheduleAction =
  | FetchEventSummarySuccess
  | FetchEventSummaryFailure;
