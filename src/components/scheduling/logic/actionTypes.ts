import { ISchedule } from 'common/models/schedule';

export const SCHEDULE_FETCH_SUCCESS = 'SCHEDULE_FETCH_SUCCESS';
export const SCHEDULE_FETCH_FAILURE = 'SCHEDULE_FETCH_FAILURE';

interface IScheduleFetchSuccess {
  type: 'SCHEDULE_FETCH_SUCCESS';
  payload: ISchedule;
}

interface IScheduleFetchFailure {
  type: 'SCHEDULE_FETCH_FAILURE';
}

export type ScheduleActionType = IScheduleFetchSuccess | IScheduleFetchFailure;
