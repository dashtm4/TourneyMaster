import { Dispatch } from 'redux';
import { Auth } from 'aws-amplify';
import api from 'api/api';
import { ISchedule, IConfigurableSchedule } from 'common/models/schedule';
import { Toasts } from 'components/common';
import {
  SCHEDULE_FETCH_IN_PROGRESS,
  SCHEDULE_FETCH_SUCCESS,
  SCHEDULE_FETCH_FAILURE,
  CREATE_NEW_SCHEDULE_SUCCESS,
  CREATE_NEW_SCHEDULE_FAILURE,
  ADD_NEW_SCHEDULE,
  CHANGE_SCHEDULE,
  UPDATE_SCHEDULE_SUCCESS,
  UPDATE_SCHEDULE_FAILURE,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_FAILURE,
} from './actionTypes';
import { EMPTY_SCHEDULE } from './constants';
import { scheduleSchema, updatedScheduleSchema } from 'validations';
import { IAppState } from 'reducers/root-reducer.types';
import History from 'browserhistory';
import { IMember } from 'common/models';
import { getVarcharEight } from 'helpers';
import { gameStartOnOptions, ISchedulingSchedule } from '../types';

const scheduleFetchInProgress = () => ({
  type: SCHEDULE_FETCH_IN_PROGRESS,
});

const scheduleFetchSuccess = (schedules: ISchedulingSchedule) => ({
  type: SCHEDULE_FETCH_SUCCESS,
  payload: {
    schedules,
  },
});

const scheduleFetchFailure = () => ({
  type: SCHEDULE_FETCH_FAILURE,
});

export const addNewSchedule = () => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  const { tournamentData } = getState().pageEvent;
  const currentSession = await Auth.currentSession();
  const userEmail = currentSession.getIdToken().payload.email;
  const members = await api.get(`/members?email_address=${userEmail}`);
  const member: IMember = members.find(
    (it: IMember) => it.email_address === userEmail
  );
  const DEFAULT_INCREMENT_MAX_NUM_GAMES = 2;
  const DEFAULT_PERIODS_PER_GAME = 2;

  const newSchedule = {
    ...EMPTY_SCHEDULE,
    schedule_id: getVarcharEight(),
    event_id: tournamentData.event?.event_id,
    member_id: member.member_id,
    num_divisions: tournamentData.divisions.length,
    num_teams: tournamentData.teams.length,
    num_fields: tournamentData.fields.length,
    min_num_games: tournamentData.event?.min_num_of_games,
    max_num_games:
      Number(tournamentData.event?.min_num_of_games) +
      DEFAULT_INCREMENT_MAX_NUM_GAMES,
    periods_per_game:
      tournamentData.event?.periods_per_game || DEFAULT_PERIODS_PER_GAME,
    pre_game_warmup: tournamentData.event?.pre_game_warmup,
    period_duration: tournamentData.event?.period_duration,
    time_btwn_periods: tournamentData.event?.time_btwn_periods,
    first_game_start: tournamentData.event?.first_game_time,
    last_game_end: tournamentData.event?.last_game_end,
    games_start_on: gameStartOnOptions[0],
  };

  dispatch({
    type: ADD_NEW_SCHEDULE,
    payload: {
      newSchedule,
    },
  });
};

export const changeSchedule = (key: Partial<ISchedule>) => ({
  type: CHANGE_SCHEDULE,
  payload: {
    scheduleKey: key,
  },
});

export const getScheduling = (eventId: string) => async (
  dispatch: Dispatch
) => {
  dispatch(scheduleFetchInProgress());

  const members = await api.get(`/members`);
  const schedules = await api.get(`/schedules?event_id=${eventId}`);
  const mappedSchedules = schedules.map((schedule: ISchedule) => {
    const createdBy = members.find((member: IMember) => {
      return member.member_id === schedule.created_by;
    });
    const updatedBy = members.find((member: IMember) => {
      return member.member_id === schedule.updated_by;
    });

    return {
      ...schedule,
      createdByName: createdBy
        ? `${createdBy.first_name} ${createdBy.last_name}`
        : null,
      updatedByName: updatedBy
        ? `${updatedBy.first_name} ${updatedBy.last_name}`
        : null,
    };
  });

  if (!schedules?.error) {
    dispatch(scheduleFetchSuccess(mappedSchedules));

    return;
  }

  dispatch(scheduleFetchFailure());
};

export const createNewSchedule = (schedule: IConfigurableSchedule) => async (
  dispatch: Dispatch
) => {
  try {
    await scheduleSchema.validate(schedule);

    dispatch({
      type: CREATE_NEW_SCHEDULE_SUCCESS,
      payload: {
        schedule,
      },
    });

    History.push(`/schedules/${schedule.event_id}`);
  } catch (err) {
    Toasts.errorToast(err.message);

    dispatch({
      type: CREATE_NEW_SCHEDULE_FAILURE,
    });
  }
};

export const updateSchedule = (schedule: ISchedulingSchedule) => async (
  dispatch: Dispatch
) => {
  try {
    const copiedSchedule = { ...schedule };
    delete copiedSchedule.createdByName;
    delete copiedSchedule.updatedByName;

    await updatedScheduleSchema.validate(copiedSchedule);

    await api.put(
      `/schedules?schedule_id=${copiedSchedule.schedule_id}`,
      copiedSchedule
    );

    dispatch({
      type: UPDATE_SCHEDULE_SUCCESS,
      payload: {
        schedule,
      },
    });

    Toasts.successToast('Changes successfully saved.');
  } catch (err) {
    Toasts.errorToast(err.message);

    dispatch({
      type: UPDATE_SCHEDULE_FAILURE,
    });
  }
};

export const deleteSchedule = (schedule: ISchedulingSchedule) => async (
  dispatch: Dispatch
) => {
  try {
    await api.delete(`/schedules?schedule_id=${schedule.schedule_id}`);

    dispatch({
      type: DELETE_SCHEDULE_SUCCESS,
      payload: {
        schedule,
      },
    });

    Toasts.successToast(
      `"${schedule.schedule_name}" schedule has been deleted.`
    );
  } catch {
    dispatch({
      type: DELETE_SCHEDULE_FAILURE,
    });
  }
};
