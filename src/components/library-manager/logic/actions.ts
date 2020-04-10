import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  LibraryManagerAction,
  LIBRARY_MANAGER_LOAD_DATA_START,
  LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
  LIBRARY_MANAGER_LOAD_DATA_FAILURE,
  SAVE_SHARED_ITEM_SUCCESS,
  SAVE_SHARED_ITEM_FAILURE,
  DELETE_LIBRARY_ITEM_SUCCESS,
  DELETE_LIBRARY_ITEM_FAILURE,
} from './action-types';
import Api from 'api/api';
import { Toasts } from 'components/common';
import {
  mapArrWithEventName,
  removeObjKeysByEntryPoint,
  sentToServerByRoute,
} from 'helpers';
import {
  IEventDetails,
  IRegistration,
  IFacility,
  IDivision,
  ISchedule,
} from 'common/models';
import { EntryPoints, MethodTypes } from 'common/enums';
import { IEntity } from 'common/types';
import {
  checkAleadyExist,
  SetFormLibraryManager,
  getClearScharedItem,
  getLibraryallowedItems,
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

    const events = await Api.get(EntryPoints.EVENTS);
    const registrations = await Api.get(EntryPoints.REGISTRATIONS);
    const facilities = await Api.get(EntryPoints.FACILITIES);
    const divisions = await Api.get(EntryPoints.DIVISIONS);
    const schedules = await Api.get(EntryPoints.SCHEDULES);

    const allowedEvents = getLibraryallowedItems(events);
    const allowedRegistrations = getLibraryallowedItems(registrations);
    const allowedFacilities = getLibraryallowedItems(facilities);
    const allowedDivision = getLibraryallowedItems(divisions);
    const allowedSchedules = getLibraryallowedItems(schedules);

    const mappedRegistrationWithEvent = mapArrWithEventName(
      allowedRegistrations,
      events
    );

    dispatch({
      type: LIBRARY_MANAGER_LOAD_DATA_SUCCESS,
      payload: {
        events: allowedEvents,
        registrations: mappedRegistrationWithEvent,
        facilities: allowedFacilities,
        divisions: allowedDivision,
        schedules: allowedSchedules,
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
      case EntryPoints.EVENTS: {
        await SetFormLibraryManager.setEventFromLibrary(
          event as IEventDetails,
          clearSharedItem as IEventDetails
        );
        break;
      }
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
      case EntryPoints.DIVISIONS: {
        await SetFormLibraryManager.setDivisionFromLibrary(
          sharedItem as IDivision,
          clearSharedItem as IDivision
        );
        break;
      }
      case EntryPoints.SCHEDULES: {
        await SetFormLibraryManager.setScheduleFromLibrary(
          clearSharedItem as ISchedule
        );
        break;
      }
    }

    dispatch({
      type: SAVE_SHARED_ITEM_SUCCESS,
    });

    Toasts.successToast('Changes successfully saved.');
  } catch (err) {
    dispatch({
      type: SAVE_SHARED_ITEM_FAILURE,
    });

    Toasts.errorToast(err.message);
  }
};

const deleteLibraryItem: ActionCreator<ThunkAction<
  void,
  {},
  null,
  LibraryManagerAction
>> = (sharedItem: IEntity, entryPoint: EntryPoints) => async (
  dispatch: Dispatch
) => {
  const clearSharedItem = removeObjKeysByEntryPoint(sharedItem, entryPoint);

  const updatedSharedItem: IEntity = {
    ...clearSharedItem,
    is_library_YN: 0,
  };

  try {
    await sentToServerByRoute(updatedSharedItem, entryPoint, MethodTypes.PUT);

    dispatch({
      type: DELETE_LIBRARY_ITEM_SUCCESS,
      payload: {
        libraryItem: sharedItem,
        entryPoint,
      },
    });

    Toasts.successToast('Changes successfully saved.');
  } catch {
    dispatch({
      type: DELETE_LIBRARY_ITEM_FAILURE,
    });
  }
};

export { loadLibraryManagerData, saveSharedItem, deleteLibraryItem };
