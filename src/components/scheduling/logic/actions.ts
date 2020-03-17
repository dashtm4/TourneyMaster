import { Dispatch } from 'redux';
import api from 'api/api';
import { ISchedule } from 'common/models/schedule';
import {
  SCHEDULE_FETCH_IN_PROGRESS,
  SCHEDULE_FETCH_SUCCESS,
  SCHEDULE_FETCH_FAILURE,
  ADD_NEW_SCHEDULE,
  CHANGE_SCHEDULE,
} from './actionTypes';
import { EMPTY_SCHEDULE } from './constants';
import { IAppState } from 'reducers/root-reducer.types';
import { getVarcharEight } from 'helpers';

export interface INewVersion {
  name: string;
  tag: string;
}

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

  const newSchedule = {
    ...EMPTY_SCHEDULE,
    schedule_id: getVarcharEight(),
    event_id: tournamentData.event?.event_id,
    num_divisions: tournamentData.divisions.length,
    num_teams: tournamentData.teams.length,
    num_fields: tournamentData.fields.length,
    min_num_of_games: tournamentData.event?.min_num_of_games,
    pre_game_warmup: tournamentData.event?.pre_game_warmup,
    period_duration: tournamentData.event?.period_duration,
    time_btwn_periods: tournamentData.event?.time_btwn_periods,
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

export const createNewVersion = (data: INewVersion) => () => {
  console.log('create New Version', data);
};
