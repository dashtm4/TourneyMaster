import { Dispatch } from 'redux';
import api from 'api/api';
import { ISchedule } from 'common/models/schedule';
import {
  SCHEDULE_FETCH_IN_PROGRESS,
  SCHEDULE_FETCH_SUCCESS,
  SCHEDULE_FETCH_FAILURE,
} from './actionTypes';
import { IAppState as EventDetailsState } from 'components/event-details/logic/reducer';

type IState = {
  event: EventDetailsState;
};

export interface INewVersion {
  name: string;
  tag: string;
}

const scheduleFetchInProgress = () => ({
  type: SCHEDULE_FETCH_IN_PROGRESS,
});

const scheduleFetchSuccess = (payload: ISchedule) => ({
  type: SCHEDULE_FETCH_SUCCESS,
  payload,
});

const scheduleFetchFailure = () => ({
  type: SCHEDULE_FETCH_FAILURE,
});

export const getScheduling = (eventId?: number) => async (
  dispatch: Dispatch,
  getState: () => IState
) => {
  const { event } = getState();
  const eventIdFromState = event?.data?.event_id;

  dispatch(scheduleFetchInProgress());

  const response = await api.get(
    `/schedules?event_id=${eventId || eventIdFromState}`
  );

  if (!response?.error) {
    dispatch(scheduleFetchSuccess(response[0] || null));
    return;
  }

  dispatch(scheduleFetchFailure());
};

export const createNewVersion = (data: INewVersion) => () => {
  console.log('create New Version', data);
};
