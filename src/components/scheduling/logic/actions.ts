import { Dispatch } from 'redux';
import api from 'api/api';
import { ISchedule } from 'common/models/schedule';
import { SCHEDULE_FETCH_SUCCESS, SCHEDULE_FETCH_FAILURE } from './actionTypes';

const scheduleFetchSuccess = (payload: ISchedule) => ({
  type: SCHEDULE_FETCH_SUCCESS,
  payload,
});

const scheduleFetchFailure = () => ({
  type: SCHEDULE_FETCH_FAILURE,
});

export const getScheduling = () => async (dispatch: Dispatch) => {
  const scheduleId = 'SCD001';
  const response = await api.get(`/schedules?schedule_id?=${scheduleId}`);
  const body = JSON.parse(response.body);

  if (!response.error && body?.length) {
    dispatch(scheduleFetchSuccess(body[0]));
    return;
  }

  scheduleFetchFailure();
};
