import { ISchedule } from 'common/models/schedule';

export const SCHEDULE_FETCH_IN_PROGRESS = 'SCHEDULE_FETCH_IN_PROGRESS';
export const SCHEDULE_FETCH_SUCCESS = 'SCHEDULE_FETCH_SUCCESS';
export const SCHEDULE_FETCH_FAILURE = 'SCHEDULE_FETCH_FAILURE';

export const CREATE_NEW_SCHEDULE_SUCCESS = 'CREATE_NEW_SCHEDULE_SUCCESS';
export const CREATE_NEW_SCHEDULE_FAILURE = 'CREATE_NEW_SCHEDULE_FAILURE';

export const ADD_NEW_SCHEDULE = 'ADD_NEW_SCHEDULE';

export const CHANGE_SCHEDULE = 'CHANGE_SCHEDULE';

interface IScheduleFetchInProgress {
  type: 'SCHEDULE_FETCH_IN_PROGRESS';
}

interface IScheduleFetchSuccess {
  type: 'SCHEDULE_FETCH_SUCCESS';
  payload: {
    schedules: ISchedule[];
  };
}

interface IScheduleFetchFailure {
  type: 'SCHEDULE_FETCH_FAILURE';
}

interface IScheduleAddNewSchedule {
  type: 'ADD_NEW_SCHEDULE';
  payload: {
    newSchedule: Partial<ISchedule>;
  };
}

interface IScheduleChangeSchedule {
  type: 'CHANGE_SCHEDULE';
  payload: {
    scheduleKey: Partial<ISchedule>;
  };
}

export type ScheduleActionType =
  | IScheduleFetchInProgress
  | IScheduleFetchSuccess
  | IScheduleFetchFailure
  | IScheduleAddNewSchedule
  | IScheduleChangeSchedule;
