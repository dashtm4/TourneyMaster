import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  LibraryManagerAction,
  LIBRARY_MANAGER_LOAD_DATA_START,
  LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
  LIBRARY_MANAGER_LOAD_DATA_FAILURE,
} from './action-types';
import Api from 'api/api';
import { mapArrWithEventName } from 'helpers';

const loadLibraryManagerData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  LibraryManagerAction
>> = () => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LIBRARY_MANAGER_LOAD_DATA_START,
    });

    const events = await Api.get('/events');
    const registrations = await Api.get('/registrations');

    const mappedRegistrationWithEvent = mapArrWithEventName(
      registrations,
      events
    );

    dispatch({
      type: LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
      payload: {
        registrations: mappedRegistrationWithEvent,
      },
    });
  } catch {
    dispatch({
      type: LIBRARY_MANAGER_LOAD_DATA_FAILURE,
    });
  }
};

export { loadLibraryManagerData };
