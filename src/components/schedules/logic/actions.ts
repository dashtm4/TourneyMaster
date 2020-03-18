import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import api from 'api/api';
import {
  FETCH_FIELDS_SUCCESS,
  FETCH_FIELDS_FAILURE,
  FETCH_EVENT_SUMMARY_SUCCESS,
} from './actionTypes';
import { IField } from 'common/models';
import { IEventSummary } from 'common/models/event-summary';

type ThunkActionType<R> = ThunkAction<R, {}, undefined, any>;

const fetchFieldsSuccess = (payload: IField[]) => ({
  type: FETCH_FIELDS_SUCCESS,
  payload,
});

const fetchFieldsFailure = () => ({
  type: FETCH_FIELDS_FAILURE,
});

const fetchEventSummarySuccess = (payload: IEventSummary[]) => ({
  type: FETCH_EVENT_SUMMARY_SUCCESS,
  payload,
});

export const fetchFields = (
  facilitiesIds: string[]
): ThunkActionType<void> => async (dispatch: Dispatch) => {
  const response: IField[] = [];
  await Promise.all(
    facilitiesIds.map(async id => {
      const fields = await api.get('/fields', { facilities_id: id });
      if (fields?.length) response.push(...fields);
    })
  );

  if (response?.length) {
    dispatch(fetchFieldsSuccess(response));
    return;
  }

  dispatch(fetchFieldsFailure());
};

export const fetchEventSummary = (
  eventId: string
): ThunkActionType<void> => async (dispatch: Dispatch) => {
  const response = await api.get('/event_summary', { event_id: eventId });

  if (response?.length) {
    dispatch(fetchEventSummarySuccess(response));
  }
};
