import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import { Storage } from 'aws-amplify';
import * as Yup from 'yup';
import api from 'api/api';
// import { getVarcharEight } from 'helpers';
import {
  EVENT_DETAILS_FETCH_START,
  EVENT_DETAILS_FETCH_SUCCESS,
  EVENT_DETAILS_FETCH_FAILURE,
  EventDetailsAction,
} from './actionTypes';
import { eventDetailsSchema } from 'validations';
import { IIconFile } from './model';
import history from 'browserhistory';
import { ICalendarEvent } from 'common/models/calendar';
import { Toasts } from 'components/common';
import {
  IDivision,
  IFacility,
  BindingAction,
  IEventDetails,
} from 'common/models';

export const eventDetailsFetchStart = () => ({
  type: EVENT_DETAILS_FETCH_START,
});

export const eventDetailsFetchSuccess = (
  payload: IEventDetails[]
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
>> = (eventDetails: IEventDetails) => async (dispatch: Dispatch) => {
  try {
    await eventDetailsSchema.validate(eventDetails);

    const response = await api.put(
      `/events?event_id=${eventDetails.event_id}`,
      eventDetails
    );

    if (response?.errorType !== undefined) {
      return Toasts.errorToast("Couldn't save the changes");
    }

    const calendarEvent: Partial<ICalendarEvent> = {
      cal_event_id: eventDetails.event_id || '',
      cal_event_title: eventDetails.event_name || '',
      cal_event_type: 'event',
      cal_event_datetime: eventDetails.created_datetime || '',
      cal_event_tag: eventDetails.event_tag || '',
      cal_event_desc: eventDetails.event_description || '',
      cal_event_startdate: eventDetails.event_startdate || '',
      cal_event_enddate: eventDetails.event_enddate || '',
      has_reminder_YN: 1,
      status_id: 1,
    };
    dispatch<any>(saveCalendarEvent(calendarEvent));

    Toasts.successToast('Changes successfully saved');

    dispatch<any>(getEventDetails(eventDetails.event_id));
  } catch (err) {
    Toasts.errorToast(err.message);
  }
};

export const saveCalendarEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (event: ICalendarEvent) => async () => {
  const eventList = await api.get(
    `/calendar_events?cal_event_id=${event.cal_event_id}`
  );

  if (eventList.length) {
    // update if exist
    const response = await api.put(
      `/calendar_events?cal_event_id=${event.cal_event_id}`,
      event
    );

    if (response?.errorType === 'Error' || response?.message === false) {
      return Toasts.errorToast("Couldn't update (calendar event)");
    }
  } else {
    // create if not exist
    const response = await api.post('/calendar_events', event);

    if (response?.errorType === 'Error' || response?.message === false) {
      return Toasts.errorToast("Couldn't create (calendar event)");
    }
  }

  Toasts.successToast('Successfully saved (calendar event)');
};

export const createEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventDetails: IEventDetails) => async (dispatch: Dispatch) => {
  try {
    const allEvents = await api.get('/events');

    await Yup.array()
      .of(eventDetailsSchema)
      .unique(
        e => e.event_name,
        'You already have an event with the same name. Event must have a unique name.'
      )
      .validate([...allEvents, eventDetails]);

    const response = await api.post('/events', eventDetails);

    if (response?.errorType !== undefined)
      return Toasts.errorToast("Couldn't save the changes");

    const calendarEvent: Partial<ICalendarEvent> = {
      cal_event_id: eventDetails.event_id || '',
      cal_event_title: eventDetails.event_name || '',
      cal_event_type: 'event',
      cal_event_datetime: eventDetails.created_datetime || '',
      cal_event_tag: eventDetails.event_tag || '',
      cal_event_desc: eventDetails.event_description || '',
      cal_event_startdate: eventDetails.event_startdate || '',
      cal_event_enddate: eventDetails.event_enddate || '',
      has_reminder_YN: 1,
      status_id: 1,
    };
    dispatch<any>(saveCalendarEvent(calendarEvent));

    Toasts.successToast('Changes successfully saved');

    history.replace(`/event/event-details/${eventDetails.event_id}`);

    dispatch<any>(getEventDetails(eventDetails.event_id));
  } catch (err) {
    Toasts.errorToast(err.message);
  }
};

// export const uploadFiles = (files: IIconFile[]) => () => {
//   if (!files || !files.length) return;

//   files.forEach((fileObject: IIconFile) => {
//     const { file, destinationType } = fileObject;
//     const uuid = uuidv4();
//     const saveFilePath = `event_media_files/${destinationType}_${uuid}_${file.name}`;
//     const config = { contentType: file.type };

//     Storage.put(saveFilePath, file, config)
//       .then(() => Toasts.successToast(`${file.name} was successfully uploaded`))
//       .catch(() => Toasts.errorToast(`${file.name} couldn't be uploaded`));
//   });
// };

export const removeFiles = (files: IIconFile[]) => () => {
  if (!files || !files.length) return;

  files.forEach(fileObject => {
    const { file, destinationType } = fileObject;
    const key = `event_media_files/${destinationType}_${file.name}`;
    Storage.remove(key)
      .then(() => Toasts.successToast(`${file.name} was successfully removed`))
      .catch(() => Toasts.errorToast(`${file.name} failed to remove`));
  });
};

export const deleteEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventId: string, eventName: string) => async (_dispatch: Dispatch) => {
  // Delete EVENT
  await api.delete(`/events?event_id=${eventId}`);

  //DELETE REGISTRATION
  const registrations = await api.get(`/registrations?event_id=${eventId}`);
  api.delete('/registrations', registrations);

  // Delete calendar event
  await api.delete(`/calendar_events?cal_event_id=${eventId}`, {
    is_active_YN: 0,
  });

  const openEvent = await api.get(
    `/calendar_events?cal_event_title=${eventName} Open`
  );
  if (openEvent.length)
    await api.delete(
      `/calendar_events?cal_event_id=${openEvent[0].cal_event_id}`,
      {
        is_active_YN: 0,
      }
    );

  const closeEvent = await api.get(
    `/calendar_events?cal_event_title=${eventName} Close`
  );
  if (closeEvent.length)
    await api.delete(
      `/calendar_events?cal_event_id=${closeEvent[0].cal_event_id}`,
      {
        is_active_YN: 0,
      }
    );

  const discountEndEvent = await api.get(
    `/calendar_events?cal_event_title=${eventName} Early Bird Discount Ends`
  );
  if (discountEndEvent.length)
    await api.delete(
      `/calendar_events?cal_event_id=${discountEndEvent[0].cal_event_id}`,
      {
        is_active_YN: 0,
      }
    );

  // DELETE DIVISIONS&POOLS
  const divisions = await api.get(`/divisions?event_id=${eventId}`);
  divisions.forEach(async (division: IDivision) => {
    const pools = await api.get(`/pools?division_id=${division.division_id}`);
    api.delete('/pools', pools);
  });
  api.delete('/divisions', divisions);

  // DELETE TEAMS
  const teams = await api.get(`/teams?event_id=${eventId}`);
  api.delete('/teams', teams);

  //DELETE FACILITIES&FIELDS
  const facilities = await api.get(`/facilities?event_id=${eventId}`);
  facilities.forEach(async (facility: IFacility) => {
    const fields = await api.get(
      `/fields?facilities_id=${facility.facilities_id}`
    );
    api.delete('/fields', fields);
  });
  api.delete('/facilities', facilities);

  Toasts.successToast('Event is successfully deleted');
  history.push('/');
};

export const createEvents: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (events: IEventDetails[], cb: BindingAction) => async (
  dispatch: Dispatch
) => {
  try {
    const allEvents = await api.get('/events');

    for (const event of events) {
      await Yup.array()
        .of(eventDetailsSchema)
        .unique(
          e => e.event_name,
          'You already have an event with the same name. Event must have a unique name.'
        )
        .validate([...allEvents, event]);
    }

    for (const event of events) {
      await api.post('/events', event);
    }
    const lastEvent = events[events.length - 1];
    const successMsg = `Events are successfully created (${events.length})`;
    Toasts.successToast(successMsg);
    cb();
    history.replace(`/event/event-details/${lastEvent.event_id}`);

    dispatch<any>(getEventDetails(lastEvent.event_id));
  } catch (err) {
    const e = err.value[err.value.length - 1];
    const index = events.findIndex(event => event.event_id === e.event_id);
    const errMessage = `Record ${index + 1}: ${err.message}`;
    return Toasts.errorToast(errMessage);
  }
};

export const createDataFromCSV: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (data: any) => async (dispatch: Dispatch) => {
  // exit when no data from CSV
  if (data.length === 0) {
    return;
  }

  const newDivisions = new Set();
  const newPools: any[] = [];
  const errDivisions: number[] = [];

  data.forEach(
    (
      {
        division_name,
        pool_name,
      }: {
        division_name: string;
        pool_name: string;
      },
      index: number
    ) => {
      if (division_name && division_name.trim()) {
        newDivisions.add(division_name);

        if (!newPools.hasOwnProperty(division_name)) {
          newPools[division_name] = new Set();
        }
        newPools[division_name].add(pool_name);
      } else {
        errDivisions.push(index);
      }
    }
  );

  if (errDivisions.length !== 0) {
    console.log('errDivisions');
    console.log(errDivisions);
    return false;
  }

  // const { event_id } = data[0];
  // const allDivisions = await api.get(`/divisions?event_id=${event_id}`);

  newDivisions.forEach(newDivision => {
    // allDivisions.some(el => el.long_name || el.short_name === )
    const newHex =
      '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
    console.log(newHex, newDivision);
    // await api.post('/divisions', {
    //   division_hex: '1c315f',
    //   division_id: getVarcharEight(),
    //   long_name: division.division_name,
    //   short_name: division.division_name,
    //   event_id,
    // });
  });

  console.log(newDivisions, newPools);

  // const dataGroupByDivision: any = {};
  // const newDivisions = {};

  // dataFromCSV.forEach((row: any[]) => {
  //   const divisionName = row['division_name'];
  //   if (!dataGroupByDivision.hasOwnProperty(divisionName)) {
  //     Object.assign(dataGroupByDivision, { [divisionName]: [] });
  //   }
  //   dataGroupByDivision[divisionName].push(row);
  // });

  // Object.keys(dataGroupByDivision).forEach((index: string) => {
  //   console.log(dataGroupByDivision[index], index);
  // divisions.forEach((row: any[]) => {
  //   console.log
  // });
  // });
  //   const division = v['Division Name'];
  //   const pool = v['Pool Name'];

  //   if (division) {
  //     divisionsFromCSV.push(division);
  //   }
  //   if (pool) {
  //     poolsFromCSV.push(pool);
  //   }
  // });

  // const allPools = await api.get(`/pools?division_id=${pool.division_id}`);

  // const divisionsFromCSV: any[] = [];
  // const poolsFromCSV: any[] = [];

  // const divisions = union(divisionsFromCSV);
  // const pools = union(poolsFromCSV);

  // for (const division of divisions) {
  //   await api.post('/divisions', {
  //     division_hex: "1c315f"
  //   division_id: "DBKSKPQR"
  //   event_id: "UMTRNKQF"
  //   long_name: "dvasd"
  //   short_name: "asdf"
  //   });
  // }
  // for (const pool of pools) {
  //   await api.post('/divisions', division);
  // }
  console.log(dispatch);
  // console.log(divisions);
  // console.log(pools);
};
