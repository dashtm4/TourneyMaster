import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  AuthPageAction,
  LOAD_AUTH_PAGE_DATA_START,
  LOAD_AUTH_PAGE_DATA_SUCCESS,
  LOAD_AUTH_PAGE_DATA_FAILURE,
  CLEAR_AUTH_PAGE_DATA,
  PUBLISH_EVENT_SUCCESS,
  PUBLISH_EVENT_FAILURE,
  ADD_ENTITY_TO_LIBRARY_SUCCESS,
  ADD_ENTITY_TO_LIBRARY_FAILURE,
  ADD_ENTITIES_TO_LIBRARY_SUCCESS,
  ADD_ENTITIES_TO_LIBRARY_FAILURE,
} from './action-types';
import { IAppState } from 'reducers/root-reducer.types';
import Api from 'api/api';
import { Toasts } from 'components/common';
import {
  IEventDetails,
  IRegistration,
  IFacility,
  IPublishSettings,
  ISchedule,
  IFetchedBracket,
} from 'common/models';
import {
  EventStatuses,
  EntryPoints,
  MethodTypes,
  LibraryStates,
  EventPublishTypes,
  BracketStatuses,
  ScheduleStatuses,
} from 'common/enums';
import { IEntity } from 'common/types';
import {
  sentToServerByRoute,
  removeObjKeysByEntryPoint,
  CheckEventDrafts,
} from 'helpers';
import {
  updateScheduleStatus,
  updateBracketStatus,
} from 'components/scheduling/logic/actions';

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

    const events = await Api.get(`/events?event_id=${eventId}`);
    const registrations = await Api.get(`/registrations?event_id=${eventId}`);
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);
    const fields = (
      await Promise.all(
        facilities.map((it: IFacility) =>
          Api.get(`/fields?facilities_id=${it.facilities_id}`)
        )
      )
    ).flat();
    const schedules = await Api.get(`/schedules?event_id=${eventId}`);
    const brackets = await Api.get(`/brackets_details?event_id=${eventId}`);

    const currentEvent = events.find(
      (it: IEventDetails) => it.event_id === eventId
    );

    const currentRegistration = registrations.find(
      (it: IRegistration) => it.event_id === eventId
    );

    dispatch({
      type: LOAD_AUTH_PAGE_DATA_SUCCESS,
      payload: {
        tournamentData: {
          event: currentEvent,
          registration: currentRegistration,
          facilities,
          fields,
          divisions,
          teams,
          schedules,
          brackets,
        },
      },
    });
  } catch (err) {
    dispatch({
      type: LOAD_AUTH_PAGE_DATA_FAILURE,
    });
  }
};

const clearAuthPageData = () => ({
  type: CLEAR_AUTH_PAGE_DATA,
});

const updateEventStatus = (isDraft: boolean) => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  const { tournamentData } = getState().pageEvent;
  const { event } = tournamentData;

  try {
    const updatedEvent = {
      ...event,
      is_published_YN: isDraft ? EventStatuses.Draft : EventStatuses.Published,
    } as IEventDetails;

    await Api.put(`/events?event_id=${updatedEvent.event_id}`, updatedEvent);

    dispatch({
      type: PUBLISH_EVENT_SUCCESS,
      payload: {
        event: updatedEvent,
      },
    });

    Toasts.successToast('Event changes successfully saved.');
  } catch {
    dispatch({
      type: PUBLISH_EVENT_FAILURE,
    });
  }
};

const publishEventData = (
  publishType: EventPublishTypes,
  publishSettings: IPublishSettings
) => async (dispatch: Dispatch, getState: () => IAppState) => {
  const { tournamentData } = getState().pageEvent;
  const { event, schedules } = tournamentData;

  switch (publishType) {
    case EventPublishTypes.DETAILS: {
      dispatch<any>(updateEventStatus(false));
      break;
    }
    case EventPublishTypes.DETAILS_AND_TOURNAMENT_PLAY: {
      const publishedSchedule = publishSettings.activeSchedule as ISchedule;

      if (event?.is_published_YN === EventStatuses.Draft) {
        dispatch<any>(updateEventStatus(false));
      }

      dispatch<any>(updateScheduleStatus(publishedSchedule.schedule_id, false));
      break;
    }

    case EventPublishTypes.DETAILS_AND_TOURNAMENT_PLAY_AND_BRACKETS: {
      const publishedSchedule = publishSettings.activeSchedule as ISchedule;
      const publishedBracket = publishSettings.activeBracket as IFetchedBracket;
      const isAllSchedulesDrafted = CheckEventDrafts.checkDraftSchedule(
        schedules
      );

      if (event?.is_published_YN === EventStatuses.Draft) {
        dispatch<any>(updateEventStatus(false));
      }

      if (isAllSchedulesDrafted) {
        dispatch<any>(
          updateScheduleStatus(publishedSchedule.schedule_id, false)
        );
      }

      dispatch<any>(updateBracketStatus(publishedBracket.bracket_id, false));
      break;
    }
  }
};

const unpublishEventData = () => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  const { tournamentData } = getState().pageEvent;
  const { schedules, brackets } = tournamentData;

  const publishedSchedule = schedules.find(
    it => it.is_published_YN === ScheduleStatuses.Published
  );

  const publishedBracket = brackets.find(
    it => it.is_published_YN === BracketStatuses.Published
  );

  if (publishedBracket) {
    dispatch<any>(updateBracketStatus(publishedBracket.bracket_id, true));
  }

  if (publishedSchedule) {
    dispatch<any>(updateScheduleStatus(publishedSchedule.schedule_id, true));
  }

  dispatch<any>(updateEventStatus(true));
};

const addEntityToLibrary = (entity: IEntity, entryPoint: EntryPoints) => async (
  dispatch: Dispatch
) => {
  try {
    if (entity.is_library_YN === LibraryStates.TRUE) {
      throw new Error('The item is already in the library.');
    }

    const updatedEntity: IEntity = {
      ...entity,
      is_library_YN: LibraryStates.TRUE,
    };

    const clearEntity = removeObjKeysByEntryPoint(updatedEntity, entryPoint);

    await sentToServerByRoute(clearEntity, entryPoint, MethodTypes.PUT);

    dispatch({
      type: ADD_ENTITY_TO_LIBRARY_SUCCESS,
      payload: {
        entity: updatedEntity,
        entryPoint,
      },
    });

    Toasts.successToast('Changes successfully saved.');
  } catch (err) {
    dispatch({
      type: ADD_ENTITY_TO_LIBRARY_FAILURE,
    });

    Toasts.errorToast(err.message);
  }
};

const addEntitiesToLibrary = (
  entities: IEntity[],
  entryPoint: EntryPoints
) => async (dispatch: Dispatch) => {
  try {
    const updatedEntities = entities.map(entity => ({
      ...entity,
      is_library_YN: LibraryStates.TRUE,
    }));

    const clearEntities = updatedEntities.map(entity =>
      removeObjKeysByEntryPoint(entity, entryPoint)
    );

    await Promise.all(
      clearEntities.map(entity =>
        sentToServerByRoute(entity, entryPoint, MethodTypes.PUT)
      )
    );

    dispatch({
      type: ADD_ENTITIES_TO_LIBRARY_SUCCESS,
      payload: {
        entities: updatedEntities,
        entryPoint,
      },
    });

    Toasts.successToast('Changes successfully saved.');
  } catch (err) {
    dispatch({
      type: ADD_ENTITIES_TO_LIBRARY_FAILURE,
    });

    Toasts.errorToast(err.message);
  }
};

export {
  loadAuthPageData,
  clearAuthPageData,
  publishEventData,
  addEntityToLibrary,
  addEntitiesToLibrary,
  unpublishEventData,
};
