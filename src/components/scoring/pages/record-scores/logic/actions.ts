import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  RecordScoresAction,
  LOAD_SCORES_DATA_START,
  LOAD_SCORES_DATA_SUCCESS,
  LOAD_SCORES_DATA_FAILURE,
} from './action-types';
import Api from 'api/api';
import { IFacility, IEventDetails, ISchedule, IDivision } from 'common/models';

const loadScoresData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  RecordScoresAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_SCORES_DATA_START,
    });

    const MOCKED_SCHEDULE_ID = 'VT1ASCPK';

    const events = await Api.get(`/events?event_id=${eventId}`);
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);
    const eventSummary = await Api.get(`/event_summary?event_id=${eventId}`);
    const schedules = await Api.get(
      `/schedules?schedule_id=${MOCKED_SCHEDULE_ID}`
    );
    const schedulesDetails = await Api.get(
      `/schedules_details?schedule_id=${MOCKED_SCHEDULE_ID}`
    );
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const fields = (
      await Promise.all(
        facilities.map((it: IFacility) =>
          Api.get(`/fields?facilities_id=${it.facilities_id}`)
        )
      )
    ).flat();

    const pools = (
      await Promise.all(
        divisions.map((it: IDivision) =>
          Api.get(`/pools?division_id=${it.division_id}`)
        )
      )
    ).flat();

    const currentEvent = events.find(
      (it: IEventDetails) => it.event_id === eventId
    );

    const currentSchedule = schedules.find(
      (it: ISchedule) => it.schedule_id === MOCKED_SCHEDULE_ID
    );

    dispatch({
      type: LOAD_SCORES_DATA_SUCCESS,
      payload: {
        event: currentEvent,
        schedule: currentSchedule,
        facilities,
        fields,
        divisions,
        teams,
        eventSummary,
        schedulesDetails,
        pools,
      },
    });
  } catch {
    dispatch({
      type: LOAD_SCORES_DATA_FAILURE,
    });
  }
};

export { loadScoresData };
