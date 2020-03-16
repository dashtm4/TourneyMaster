import {
  EVENTS_FETCH_SUCCESS,
  EVENTS_FETCH_FAILURE,
  DASHBOARD_TEAMS_FETCH_SUCCESS,
  FIELDS_FETCH_SUCCESS,
  DASHBOARD_FETCH_START,
} from './actionTypes';
import api from 'api/api';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Toasts } from 'components/common';
import { IFacility, ITeam, IField } from 'common/models';

export const fetchStart = (): { type: string } => ({
  type: DASHBOARD_FETCH_START,
});

export const eventsFetchSuccess = (
  payload: EventDetailsDTO[]
): { type: string; payload: EventDetailsDTO[] } => ({
  type: EVENTS_FETCH_SUCCESS,
  payload,
});

export const eventDetailsFetchFailure = (): { type: string } => ({
  type: EVENTS_FETCH_FAILURE,
});

export const dashboardTeamsFetchSuccess = (
  payload: ITeam[]
): { type: string; payload: ITeam[] } => ({
  type: DASHBOARD_TEAMS_FETCH_SUCCESS,
  payload,
});

export const fieldsFetchSuccess = (
  payload: IField[]
): { type: string; payload: IField[] } => ({
  type: FIELDS_FETCH_SUCCESS,
  payload,
});

export const getEvents: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  dispatch(fetchStart());
  const events = await api.get('/events');
  if (!events) {
    dispatch(eventDetailsFetchFailure());
    return Toasts.errorToast("Couldn't load tournaments");
  }
  dispatch(eventsFetchSuccess(events));

  const teams = await api.get(`/teams`);

  let facilities: IFacility[] = [];
  for await (const event of events) {
    const fac = await api.get(`/facilities?event_id=${event.event_id}`);
    facilities = [...facilities, ...fac];
  }

  let fields: IField[] = [];
  for await (const facility of facilities) {
    const flds = await api.get(
      `/fields?facilities_id=${facility.facilities_id}`
    );

    const updFields = flds.map((field: IField) => ({
      ...field,
      event_id: facility.event_id,
    }));
    fields = [...fields, ...updFields];
  }
  dispatch(fieldsFetchSuccess(fields));
  dispatch(dashboardTeamsFetchSuccess(teams));
};
