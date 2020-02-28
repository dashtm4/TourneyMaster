import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  RecordScoresAction,
  LOAD_SCORES_DATA_START,
  LOAD_SCORES_DATA_SUCCESS,
  LOAD_SCORES_DATA_FAILURE,
} from './action-types';
import Api from 'api/api';
import { IFacility } from 'common/models';

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

    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);
    // const fields = await Api.get(`/fields?event_id=${eventId}`);
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const fields = await Promise.all(
      facilities.map((it: IFacility) =>
        Api.get(`/fields?facilities_id=${it.facilities_id}`)
      )
    );

    await dispatch({
      type: LOAD_SCORES_DATA_SUCCESS,
      payload: {
        divisions,
        teams,
        fields: fields.flat(),
      },
    });
  } catch {
    dispatch({
      type: LOAD_SCORES_DATA_FAILURE,
    });
  }
};

export { loadScoresData };
