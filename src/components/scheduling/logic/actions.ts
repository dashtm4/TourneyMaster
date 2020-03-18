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
} from './actionTypes';
import { EMPTY_SCHEDULE } from './constants';
import { scheduleSchema } from 'validations';
import { IAppState } from 'reducers/root-reducer.types';
import History from 'browserhistory';
import { IMember } from 'common/models';
import {
  getVarcharEight,
  getTimeValuesFromEvent,
  calculateTimeSlots,
} from 'helpers';

const scheduleFetchInProgress = () => ({
  type: SCHEDULE_FETCH_IN_PROGRESS,
});

const scheduleFetchSuccess = (schedules: ISchedule[]) => ({
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
  const DEFAUL_GAME_START_ON = '5';

  const newSchedule = {
    ...EMPTY_SCHEDULE,
    schedule_id: getVarcharEight(),
    event_id: tournamentData.event?.event_id,
    member_id: member.member_id,
    num_divisions: tournamentData.divisions.length,
    num_teams: tournamentData.teams.length,
    num_fields: tournamentData.fields.length,
    min_num_games: tournamentData.event?.min_num_of_games,
    max_num_games: Number(tournamentData.event?.min_num_of_games) + 1,
    periods_per_game: tournamentData.event?.periods_per_game || 2,
    pre_game_warmup: tournamentData.event?.pre_game_warmup,
    period_duration: tournamentData.event?.period_duration,
    time_btwn_periods: tournamentData.event?.time_btwn_periods,
    games_start_on: DEFAUL_GAME_START_ON,
    time_slots: calculateTimeSlots(
      getTimeValuesFromEvent(tournamentData.event!)
    ),
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

  const response = await api.get(`/schedules?event_id=${eventId}`);

  if (!response?.error) {
    dispatch(scheduleFetchSuccess(response));

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
