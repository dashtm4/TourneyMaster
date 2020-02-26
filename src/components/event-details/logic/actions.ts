import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import { Storage } from 'aws-amplify';
import uuidv4 from 'uuid/v4';

import {
  EVENT_DETAILS_FETCH_START,
  EVENT_DETAILS_FETCH_SUCCESS,
  EVENT_DETAILS_FETCH_FAILURE,
  EventDetailsAction,
} from './actionTypes';

import api from 'api/api';
import { EventDetailsDTO, IIconFile } from './model';
import { requiredFieldsNotEmpty } from '../state';
import history from 'browserhistory';
import { Toasts } from 'components/common';

export const eventDetailsFetchStart = () => ({
  type: EVENT_DETAILS_FETCH_START,
});

export const eventDetailsFetchSuccess = (
  payload: EventDetailsDTO[]
): EventDetailsAction => ({
  type: EVENT_DETAILS_FETCH_SUCCESS,
  payload,
});

export const eventDetailsFetchFailure = (): EventDetailsAction => ({
  type: EVENT_DETAILS_FETCH_FAILURE,
});

export const getEventDetails: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  dispatch(eventDetailsFetchStart());

  const eventDetails = await api.get('/events', { event_id: eventId });

  if (eventDetails) {
    dispatch(eventDetailsFetchSuccess(eventDetails));
  } else {
    dispatch(eventDetailsFetchFailure());
  }
};

export const saveEventDetails: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventDetails: EventDetailsDTO) => async (dispatch: Dispatch) => {
  const allRequiredFields = requiredFieldsNotEmpty(eventDetails);

  if (!allRequiredFields)
    return Toasts.errorToast('All required fields must be filled');

  const response = await api.put(
    `/events?event_id=${eventDetails.event_id}`,
    eventDetails
  );

  if (response?.errorType !== undefined) {
    return Toasts.errorToast("Couldn't save the changes");
  }

  Toasts.successToast('Changes successfully saved');

  dispatch<any>(getEventDetails(eventDetails.event_id));
};

export const createEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventDetails: EventDetailsDTO) => async (dispatch: Dispatch) => {
  const allRequiredFields = requiredFieldsNotEmpty(eventDetails);

  if (!allRequiredFields)
    return Toasts.errorToast('All required fields must be filled');

  const response = await api.post('/events', eventDetails);

  if (response?.errorType !== undefined)
    return Toasts.errorToast("Couldn't save the changes");

  Toasts.successToast('Changes successfully saved');

  history.replace(`/event/event-details/${eventDetails.event_id}`);

  dispatch<any>(getEventDetails(eventDetails.event_id));
};

export const uploadFiles = (files: IIconFile[]) => () => {
  if (!files || !files.length) return;

  files.forEach((fileObject: IIconFile) => {
    const { file, destinationType } = fileObject;
    const uuid = uuidv4();
    const saveFilePath = `event_media_files/${destinationType}_${uuid}_${file.name}`;
    const config = { contentType: file.type };

    Storage.put(saveFilePath, file, config)
      .then(() => Toasts.successToast(`${file.name} was successfully uploaded`))
      .catch(() => Toasts.errorToast(`${file.name} couldn't be uploaded`));
  });
};
