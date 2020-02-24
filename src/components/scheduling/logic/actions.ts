import { Dispatch } from 'redux';
import api from 'api/api';
import { ISchedule } from 'common/models/schedule';
import { SCHEDULE_FETCH_SUCCESS, SCHEDULE_FETCH_FAILURE } from './actionTypes';

export interface INewVersion {
  name: string;
  tag: string;
}

const scheduleFetchSuccess = (payload: ISchedule) => ({
  type: SCHEDULE_FETCH_SUCCESS,
  payload,
});

const scheduleFetchFailure = () => ({
  type: SCHEDULE_FETCH_FAILURE,
});

export const getScheduling = () => async (dispatch: Dispatch) => {
  const scheduleId = 'SCD001';
  const response = await api.get(`/schedules?schedule_id=${scheduleId}`);

  if (!response?.error && response?.length) {
    dispatch(scheduleFetchSuccess(response[0]));
    return;
  }

  scheduleFetchFailure();
};

export const createNewVersion = (data: INewVersion) => () => {
  console.log('data is here', data);
};
