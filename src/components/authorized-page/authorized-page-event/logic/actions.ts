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

    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);

    dispatch({
      type: LOAD_AUTH_PAGE_DATA_SUCCESS,
      payload: {
        facilities,
        divisions,
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
