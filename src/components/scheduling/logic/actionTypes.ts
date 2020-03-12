import { ISchedule } from 'common/models/schedule';

export const SCHEDULE_FETCH_IN_PROGRESS = 'SCHEDULE_FETCH_IN_PROGRESS';
export const SCHEDULE_FETCH_SUCCESS = 'SCHEDULE_FETCH_SUCCESS';
export const SCHEDULE_FETCH_FAILURE = 'SCHEDULE_FETCH_FAILURE';

interface IScheduleFetchInProgress {
  type: 'SCHEDULE_FETCH_IN_PROGRESS';
}

interface IScheduleFetchSuccess {
  type: 'SCHEDULE_FETCH_SUCCESS';
  payload: ISchedule;
}

interface IScheduleFetchFailure {
  type: 'SCHEDULE_FETCH_FAILURE';
}

export type ScheduleActionType =
  | IScheduleFetchInProgress
  | IScheduleFetchSuccess
  | IScheduleFetchFailure;
