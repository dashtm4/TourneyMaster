import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  LibraryManagerAction,
  LIBRARY_MANAGER_LOAD_DATA_START,
  LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
  LIBRARY_MANAGER_LOAD_DATA_FAILURE,
} from './action-types';
import Api from 'api/api';

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

    const registrations = await Api.get('/registrations');

    dispatch({
      type: LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
      payload: {
        registrations,
      },
    });
  } catch {
    dispatch({
      type: LIBRARY_MANAGER_LOAD_DATA_FAILURE,
    });
  }
};

export { loadLibraryManagerData };
