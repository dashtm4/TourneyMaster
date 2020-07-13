import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import Api from 'api/api';
import {
  LOAD_REGISTRANT_DATA_START,
  LOAD_REGISTRANT_DATA_SUCCESS,
  LOAD_REGISTRANT_DATA_FAIL,
  PlayerStatsAction,
} from './action-types';

export const loadRegistrantData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  PlayerStatsAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_REGISTRANT_DATA_START,
      payload: '',
    });

    const registrantDataRequests = await Api.get(
      `/registrant_data_requests?event_id=${eventId}`
    );
    const registrantDataFields = await Api.get('/registrant_data_fields');

    let result = registrantDataFields;
    try {
      if (registrantDataRequests.length > 0) {
        const idList = JSON.parse(registrantDataRequests[0].data_field_id_list);
        if (idList.length > 0) {
          result = registrantDataFields.filter((el: any) =>
            idList.some((id: any) => id === el.data_field_id)
          );
        }
      }
    } catch (error) {
      console.error(error);
    }

    dispatch({
      type: LOAD_REGISTRANT_DATA_SUCCESS,
      payload: { registrantDataFields: result },
    });
  } catch {
    dispatch({
      type: LOAD_REGISTRANT_DATA_FAIL,
    });
  }
};
