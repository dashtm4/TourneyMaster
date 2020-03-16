import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  RecordScoresAction,
  LOAD_SCORES_DATA_START,
  LOAD_SCORES_DATA_SUCCESS,
  LOAD_SCORES_DATA_FAILURE,
} from './action-types';
import Api from 'api/api';

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
    const eventSummary = await Api.get(`/event_summary?event_id=${eventId}`);

    dispatch({
      type: LOAD_SCORES_DATA_SUCCESS,
      payload: {
        divisions,
        teams,
        eventSummary,
      },
    });
  } catch {
    dispatch({
      type: LOAD_SCORES_DATA_FAILURE,
    });
  }
};

export { loadScoresData };
