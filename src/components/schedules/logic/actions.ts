import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { chunk } from 'lodash-es';
import api from 'api/api';
import {
  FETCH_FIELDS_SUCCESS,
  FETCH_FIELDS_FAILURE,
  FETCH_EVENT_SUMMARY_SUCCESS,
  SCHEDULES_DRAFT_SAVED_SUCCESS,
  SCHEDULES_SAVING_IN_PROGRESS,
  SCHEDULES_DRAFT_SAVED_FAILURE,
  FETCH_SCHEDULES_DETAILS_SUCCESS,
  FETCH_SCHEDULES_DETAILS_FAILURE,
  SCHEDULES_PUBLISHED_SUCCESS,
  SCHEDULES_PUBLISHED_FAILURE,
} from './actionTypes';
import { IField, ISchedule } from 'common/models';
import { IEventSummary } from 'common/models/event-summary';
import { IAppState } from 'reducers/root-reducer.types';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';
import { successToast, errorToast } from 'components/common/toastr/showToasts';
import { ISchedulesGame } from 'common/models/schedule/game';

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

const schedulesSavingInProgress = () => ({
  type: SCHEDULES_SAVING_IN_PROGRESS,
});

const draftSavedFailure = () => ({
  type: SCHEDULES_DRAFT_SAVED_FAILURE,
});

const fetchSchedulesDetailsSuccess = (payload: {
  schedule: ISchedule;
  schedulesDetails: ISchedulesDetails[];
}) => ({
  type: FETCH_SCHEDULES_DETAILS_SUCCESS,
  payload,
});

const publishedSuccess = () => ({
  type: SCHEDULES_PUBLISHED_SUCCESS,
});
const publishFailure = () => ({
  type: SCHEDULES_PUBLISHED_FAILURE,
});

const fetchSchedulesDetailsFailure = () => ({
  type: FETCH_SCHEDULES_DETAILS_FAILURE,
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

export const saveDraft = (
  scheduleData: ISchedule,
  scheduleDetails: ISchedulesDetails[]
): ThunkActionType<void> => async (dispatch: Dispatch) => {
  const scheduleCondition = scheduleData;
  dispatch(schedulesSavingInProgress());

  try {
    if (scheduleCondition) {
      await api.post('/schedules', scheduleData);
    }

    const scheduleDetailsChunk = chunk(scheduleDetails, 50);

    await Promise.all(
      scheduleDetailsChunk.map(async arr => {
        await api.post('/schedules_details', arr);
      })
    );

    dispatch(draftSavedSuccess());
    successToast('Schedules data successfully saved');
  } catch {
    dispatch(draftSavedFailure());
    errorToast('Something happened during the saving process');
  }
};

export const updateDraft = (
  schedulesDetails: ISchedulesDetails[]
): ThunkActionType<void> => async (dispatch: Dispatch) => {
  dispatch(schedulesSavingInProgress());

  const schedulesDetailsChunk = chunk(schedulesDetails, 50);

  const responses = await Promise.all(
    schedulesDetailsChunk.map(
      async arr => await api.put('/schedules_details', arr)
    )
  );
  const responseOk = responses.every(item => item);

  if (responseOk) {
    dispatch(draftSavedSuccess());
    successToast('Schedules data successfully saved');
    return;
  }

  dispatch(draftSavedFailure());
  errorToast('Something happened during the saving process');
};

export const publishSchedulesDetails = (
  schedulesDetails: ISchedulesDetails[],
  schedulesGames: ISchedulesGame[]
) => async (dispatch: Dispatch) => {
  dispatch(schedulesSavingInProgress());

  const schedulesDetailsChunk = chunk(schedulesDetails, 50);
  const schedulesResponses = await Promise.all(
    schedulesDetailsChunk.map(
      async arr => await api.put('/schedules_details', arr)
    )
  );
  const schedulesResponseOk = schedulesResponses.every(item => item);

  if (!schedulesResponseOk) {
    return errorToast('Something happened during the publishing process');
  }

  const schedulesGamesChunk = chunk(schedulesGames, 50);
  const gamesResponses = await Promise.all(
    schedulesGamesChunk.map(async arr => await api.post('/games', arr))
  );
  const gamesResponseOk = gamesResponses.every(item => item);

  if (schedulesResponseOk && gamesResponseOk) {
    dispatch(publishedSuccess());
    successToast('Schedules data successfully saved and published!');
    return;
  }

  dispatch(publishFailure());
  errorToast('Something happened during the saving process');
};

export const updatePublishedSchedulesDetails = (
  schedulesDetails: ISchedulesDetails[],
  schedulesGames: ISchedulesGame[]
) => async (dispatch: Dispatch) => {
  dispatch(schedulesSavingInProgress());

  const schedulesDetailsChunk = chunk(schedulesDetails, 50);
  const schedulesResponses = await Promise.all(
    schedulesDetailsChunk.map(
      async arr => await api.put('/schedules_details', arr)
    )
  );
  const schedulesResponseOk = schedulesResponses.every(item => item);

  if (!schedulesResponseOk) {
    return errorToast('Something happened during the publishing process');
  }

  const schedulesGamesChunk = chunk(schedulesGames, 50);
  const gamesResponses = await Promise.all(
    schedulesGamesChunk.map(async arr => await api.put('/games', arr))
  );
  const gamesResponseOk = gamesResponses.every(item => item);

  if (schedulesResponseOk && gamesResponseOk) {
    dispatch(publishedSuccess());
    successToast('Schedules data successfully saved and published!');
    return;
  }

  dispatch(publishFailure());
  errorToast('Something happened during the saving process');
};

export const fetchSchedulesDetails = (scheduleId: string) => async (
  dispatch: Dispatch
) => {
  const schedules: ISchedule = await api.get('schedules', {
    schedule_id: scheduleId,
  });
  const schedulesDetails: ISchedulesDetails[] = await api.get(
    'schedules_details',
    {
      schedule_id: scheduleId,
    }
  );

  const schedule = schedules && schedules[0];

  if (schedule && schedulesDetails) {
    dispatch(
      fetchSchedulesDetailsSuccess({
        schedule,
        schedulesDetails,
      })
    );
  } else {
    dispatch(fetchSchedulesDetailsFailure());
  }
};

export const getPublishedGames = (scheduleId: string) => async (
  dispatch: Dispatch
) => {
  const response = await api.get('/games', { schedule_id: scheduleId });
  if (response) {
    dispatch(publishedSuccess());
  }
};
