import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import api from 'api/api';
import {
  FETCH_FIELDS_SUCCESS,
  FETCH_FIELDS_FAILURE,
  FETCH_EVENT_SUMMARY_SUCCESS,
  SCHEDULES_DRAFT_SAVED_SUCCESS,
  // SCHEDULES_DRAFT_SAVED_FAILURE,
} from './actionTypes';
import { IField, ISchedule } from 'common/models';
import { IEventSummary } from 'common/models/event-summary';
import { IAppState } from 'reducers/root-reducer.types';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';
import { successToast, errorToast } from 'components/common/toastr/showToasts';

type ThunkActionType<R> = ThunkAction<R, IAppState, undefined, any>;

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

const draftSavedSuccess = () => ({
  type: SCHEDULES_DRAFT_SAVED_SUCCESS,
});

// const draftSavedFailure = () => ({
//   type: SCHEDULES_DRAFT_SAVED_FAILURE,
// });

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

export const saveDraft = (
  scheduleData: ISchedule,
  scheduleDetails: ISchedulesDetails[]
): ThunkActionType<void> => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  const { draftIsAlreadySaved } = getState().schedules;

  let scheduleResponse;
  const scheduleCondition = scheduleData && !draftIsAlreadySaved;

  if (scheduleCondition) {
    scheduleResponse = await api.post('/schedules', scheduleData);
  }

  const response = await api.post('/schedules_details', scheduleDetails);

  if (response && !!(!scheduleCondition || scheduleResponse)) {
    dispatch(draftSavedSuccess());
    successToast('Schedules data successfully saved!');
  } else {
    errorToast('Something happend during the saving process.');
  }
};
