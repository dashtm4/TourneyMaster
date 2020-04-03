import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  LibraryManagerAction,
  LIBRARY_MANAGER_LOAD_DATA_START,
  LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
  LIBRARY_MANAGER_LOAD_DATA_FAILURE,
  SAVE_SHARED_ITEM_SUCCESS,
  SAVE_SHARED_ITEM_FAILURE,
} from './action-types';
import Api from 'api/api';
import { Toasts } from 'components/common';
import { mapArrWithEventName } from 'helpers';
import {
  IEventDetails,
  IRegistration,
  IFacility,
  // IFacility
} from 'common/models';
import { EntryPoints } from 'common/enums';
import { IEntity } from 'common/types';
import {
  checkAleadyExist,
  SetFormLibraryManager,
  getClearScharedItem,
} from '../helpers';

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
    const facilities = await Api.get('/facilities');

    const mappedRegistrationWithEvent = mapArrWithEventName(
      registrations,
      events
    );

    dispatch({
      type: LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
      payload: {
        events,
        registrations: mappedRegistrationWithEvent,
        facilities,
      },
    });
  } catch {
    dispatch({
      type: LIBRARY_MANAGER_LOAD_DATA_FAILURE,
    });
  }
};

const saveSharedItem: ActionCreator<ThunkAction<
  void,
  {},
  null,
  LibraryManagerAction
>> = (
  event: IEventDetails,
  sharedItem: IEntity,
  entryPoint: EntryPoints
) => async (dispatch: Dispatch) => {
  try {
    await checkAleadyExist(sharedItem, event, entryPoint);

    const clearSharedItem = getClearScharedItem(sharedItem, event, entryPoint);

    switch (entryPoint) {
      case EntryPoints.REGISTRATIONS: {
        await SetFormLibraryManager.setRegistrationFromLibrary(
          sharedItem as IRegistration,
          clearSharedItem as IRegistration,
          event
        );
        break;
      }
      case EntryPoints.FACILITIES: {
        await SetFormLibraryManager.setFacilityFromLibrary(
          sharedItem as IFacility,
          clearSharedItem as IFacility
        );
        break;
      }
    }

    dispatch({
      type: SAVE_SHARED_ITEM_SUCCESS,
    });

    Toasts.successToast('Changes successfully saved.');
  } catch (err) {
    Toasts.errorToast(err.message);

    dispatch({
      type: SAVE_SHARED_ITEM_FAILURE,
    });
  }
};

export { loadLibraryManagerData, saveSharedItem };
