import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  AuthPageAction,
  LOAD_AUTH_PAGE_DATA_START,
  LOAD_AUTH_PAGE_DATA_SUCCESS,
  LOAD_AUTH_PAGE_DATA_FAILURE,
  CLEAR_AUTH_PAGE_DATA,
  PUBLISH_TOURNAMENT_SUCCESS,
  PUBLISH_TOURNAMENT_FAILURE,
} from './action-types';
import Api from 'api/api';
import { Toasts } from 'components/common';
import { IEventDetails } from 'common/models';
import { EventStatuses } from 'common/enums';

const loadAuthPageData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  AuthPageAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_AUTH_PAGE_DATA_START,
    });

    const event = await Api.get(`/events?event_id=${eventId}`);
    const registration = await Api.get(`/registrations?event_id=${eventId}`);
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);

    dispatch({
      type: LOAD_AUTH_PAGE_DATA_SUCCESS,
      payload: {
        facilities,
        divisions,
        tournamentData: {
          event: event[0],
          registration: registration[0],
          facilities,
          divisions,
          teams,
        },
      },
    });
  } catch {
    dispatch({
      type: LOAD_AUTH_PAGE_DATA_FAILURE,
    });
  }
};

const clearAuthPageData = () => ({
  type: CLEAR_AUTH_PAGE_DATA,
});

const publishTournament: ActionCreator<ThunkAction<
  void,
  {},
  null,
  AuthPageAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    const events = await Api.get(`/events?event_id=${eventId}`);
    const currentEvent = events.find(
      (it: IEventDetails) => it.event_id === eventId
    );
    const updatedEvent = {
      ...currentEvent,
      event_status: EventStatuses.PUBLIHSED,
    };

    Api.put(`/events?event_id=${updatedEvent.event_id}`, updatedEvent);

    dispatch({
      type: PUBLISH_TOURNAMENT_SUCCESS,
      payload: {
        event: updatedEvent,
      },
    });

    Toasts.successToast('Tournament successfully created.');
  } catch {
    dispatch({
      type: PUBLISH_TOURNAMENT_FAILURE,
    });
  }
};

export { loadAuthPageData, clearAuthPageData, publishTournament };
