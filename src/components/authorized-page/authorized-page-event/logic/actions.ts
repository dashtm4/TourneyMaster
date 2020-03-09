import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  authPageAction,
  LOAD_AUTH_PAGE_DATA_START,
  LOAD_AUTH_PAGE_DATA_SUCCESS,
  LOAD_AUTH_PAGE_DATA_FAILURE,
  CLEAR_AUTH_PAGE_DATA,
} from './action-types';
import Api from 'api/api';

const loadAuthPageData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  authPageAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_AUTH_PAGE_DATA_START,
    });

    const event = await Api.get(`/events?event_id=${eventId}`);
    const registration = await Api.get(`/registrations?event_id=${eventId}`);
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?=event_id=${eventId}`);

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

export { loadAuthPageData, clearAuthPageData };
