import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  ReportingAction,
  LOAD_REPORTING_DATA_START,
  LOAD_REPORTING_DATA_SUCCESS,
  LOAD_REPORTING_DATA_FAILURE,
} from './action-types';
import Api from 'api/api';
import { IFacility, IEventDetails } from 'common/models';

const loadReportingData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  ReportingAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_REPORTING_DATA_START,
    });

    const events = await Api.get(`/events?event_id=${eventId}`);
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);
    const schedules = await Api.get('/schedules');
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const fields = (
      await Promise.all(
        facilities.map((it: IFacility) =>
          Api.get(`/fields?facilities_id=${it.facilities_id}`)
        )
      )
    ).flat();

    const currentEvent = events.find(
      (it: IEventDetails) => it.event_id === eventId
    );

    // // ! use enum in future
    // const activeSchedule = schedules.find(
    //   (it: ISchedule) => it.schedule_status === 'Published'
    // );

    const schedulesDetails = await Api.get(
      `/schedules_details?schedule_id=${schedules[0].schedule_id}`
    );

    dispatch({
      type: LOAD_REPORTING_DATA_SUCCESS,
      payload: {
        event: currentEvent,
        schedule: schedules[0],
        // schedule: activeSchedule,
        facilities,
        fields,
        divisions,
        teams,
        schedulesDetails,
      },
    });
  } catch {
    dispatch({
      type: LOAD_REPORTING_DATA_FAILURE,
    });
  }
};

export { loadReportingData };
