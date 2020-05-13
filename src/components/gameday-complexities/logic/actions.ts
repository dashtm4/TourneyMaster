import {
  EVENTS_FETCH_SUCCESS,
  FACILITIES_FETCH_SUCCESS,
  FIELDS_FETCH_SUCCESS,
  BACKUP_PLANS_FETCH_SUCCESS,
  ADD_BACKUP_PLAN_SUCCESS,
  DELETE_BACKUP_PLAN,
  UPDATE_BACKUP_PLAN,
  LOAD_TIMESLOTS_START,
  LOAD_TIMESLOTS_SUCCESS,
  LOAD_TIMESLOTS_FAILURE,
} from './actionTypes';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import api from 'api/api';
import { Toasts } from 'components/common';
import {
  IFacility,
  IField,
  IEventDetails,
  ISchedule,
  ISchedulesGame,
} from 'common/models';
import { IBackupPlan } from 'common/models/backup_plan';
import {
  getVarcharEight,
  sortByField,
  getTimeSlotsFromEntities,
} from 'helpers';
import { stringifyBackupPlan } from '../helper';
import {
  ScheduleStatuses,
  SortByFilesTypes,
  TimeSlotsEntityTypes,
} from 'common/enums';
import { IAppState } from 'reducers/root-reducer.types';

export const eventsFetchSuccess = (payload: {
  events: IEventDetails[];
  schedules: ISchedule[];
}): {
  type: string;
  payload: {
    events: IEventDetails[];
    schedules: ISchedule[];
  };
} => ({
  type: EVENTS_FETCH_SUCCESS,
  payload,
});

export const facilitiesFetchSuccess = (
  payload: IFacility[]
): { type: string; payload: IFacility[] } => ({
  type: FACILITIES_FETCH_SUCCESS,
  payload,
});

export const fieldsFetchSuccess = (
  payload: IField[]
): { type: string; payload: IField[] } => ({
  type: FIELDS_FETCH_SUCCESS,
  payload,
});

export const backupPlansFetchSuccess = (
  payload: IBackupPlan[]
): { type: string; payload: IBackupPlan[] } => ({
  type: BACKUP_PLANS_FETCH_SUCCESS,
  payload,
});

export const addBackupPlanSuccess = (
  payload: IBackupPlan
): { type: string; payload: IBackupPlan } => ({
  type: ADD_BACKUP_PLAN_SUCCESS,
  payload,
});

export const deleteBackupPlanSuccess = (
  payload: string
): { type: string; payload: string } => ({
  type: DELETE_BACKUP_PLAN,
  payload,
});

export const updateBackupPlanSuccess = (
  payload: Partial<IBackupPlan>
): { type: string; payload: Partial<IBackupPlan> } => ({
  type: UPDATE_BACKUP_PLAN,
  payload,
});

export const getEvents: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const events = await api.get('/events');
  const schedules = await api.get('/schedules');

  if (!events || !schedules) {
    return Toasts.errorToast("Couldn't load tournaments");
  }

  const publishedSchedules = schedules.filter(
    (schedule: ISchedule) =>
      schedule.is_published_YN === ScheduleStatuses.Published
  );

  const allowdEvents = events.filter((event: IEventDetails) => {
    const isPublishedSchedule = publishedSchedules.some(
      (schedule: ISchedule) => schedule.event_id === event.event_id
    );

    return isPublishedSchedule;
  });

  dispatch(
    eventsFetchSuccess({
      events: allowdEvents,
      schedules: publishedSchedules,
    })
  );
};

export const getFacilities: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const facilities = await api.get('/facilities');
  if (!facilities) {
    return Toasts.errorToast("Couldn't load facilities");
  }
  dispatch(facilitiesFetchSuccess(facilities));
};

export const getFields: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const fields = await api.get('/fields');
  if (!fields) {
    return Toasts.errorToast("Couldn't load fields");
  }
  dispatch(fieldsFetchSuccess(fields));
};

export const getBackupPlans: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  const backupPlans = await api.get('/backup_plans');
  if (!backupPlans) {
    return Toasts.errorToast("Couldn't load backup plans");
  }

  const sortedBackup = sortByField(
    backupPlans,
    SortByFilesTypes.BACKUP_PLAN
  ) as IBackupPlan[];

  dispatch(backupPlansFetchSuccess(sortedBackup));
};

export const saveBackupPlans: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (backupPlans: IBackupPlan[]) => async (dispatch: Dispatch) => {
  for await (const backupPlan of backupPlans) {
    if (
      !backupPlan.backup_name ||
      !backupPlan.event_id ||
      !backupPlan.facilities_impacted?.length ||
      !backupPlan.fields_impacted?.length ||
      !backupPlan.timeslots_impacted?.length
    ) {
      return Toasts.errorToast('All fields are required!');
    }

    const stringifiedBackupPlan = stringifyBackupPlan(backupPlan);
    const data = {
      ...stringifiedBackupPlan,
      backup_plan_id: getVarcharEight(),
    };
    const response = await api.post(`/backup_plans`, data);

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't add a division");
    }
    dispatch(addBackupPlanSuccess(data));
  }

  Toasts.successToast('Backup Plan is successfully added');
};

export const deleteBackupPlan: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (id: string) => async (dispatch: Dispatch) => {
  const backupPlan = await api.delete(`/backup_plans?backup_plan_id=${id}`);
  if (!backupPlan) {
    return Toasts.errorToast("Couldn't delete a backup plans");
  }
  dispatch(deleteBackupPlanSuccess(id));
  Toasts.successToast('Backup Plan is successfully deleted');
};

export const updateBackupPlan: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (backupPlan: IBackupPlan) => async (dispatch: Dispatch) => {
  if (
    !backupPlan.backup_name ||
    !backupPlan.event_id ||
    !backupPlan.facilities_impacted?.length ||
    !backupPlan.fields_impacted?.length ||
    !backupPlan.timeslots_impacted?.length
  ) {
    return Toasts.errorToast('All fields are required!');
  }

  const data = stringifyBackupPlan(backupPlan);

  const response = await api.put(
    `/backup_plans?backup_plan_id=${data.backup_plan_id}`,
    data
  );
  if (!response) {
    return Toasts.errorToast("Couldn't update a backup plans");
  }
  dispatch(updateBackupPlanSuccess(data));
  Toasts.successToast('Backup Plan is successfully updated');
};

export const loadTimeSlots = (eventId: string) => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  try {
    const { complexities } = getState();

    const currentSchedule = complexities.schedules.find(
      (it: ISchedule) => it.event_id === eventId
    );

    if (!currentSchedule) {
      throw new Error('Could not load time slots!');
    }

    dispatch({
      type: LOAD_TIMESLOTS_START,
      payload: {
        eventId,
      },
    });

    const scheduleGames = (await api.get(
      `/games?schedule_id=${currentSchedule.schedule_id}`
    )) as ISchedulesGame[];

    const timeSlots = getTimeSlotsFromEntities(
      scheduleGames,
      TimeSlotsEntityTypes.SCHEDULE_GAMES
    );

    const gameDates = Array.from(
      new Set(scheduleGames.map(it => it.game_date))
    );

    dispatch({
      type: LOAD_TIMESLOTS_SUCCESS,
      payload: {
        eventId,
        gameDates,
        eventTimeSlots: timeSlots,
      },
    });
  } catch (err) {
    dispatch({
      type: LOAD_TIMESLOTS_FAILURE,
    });

    Toasts.errorToast(err.message);
  }
};
