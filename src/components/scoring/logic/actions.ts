import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import { TeamsAction, SUCCESS, FAILURE, LOAD_TEAMS } from './action-types';
// import Api from 'api/api';

import { teams } from '../mocks/teams';

const loadTeams: ActionCreator<ThunkAction<
  void,
  {},
  null,
  TeamsAction
>> = () => async (dispatch: Dispatch) => {
  try {
    // const teams = await Api.get('');

    dispatch({
      type: LOAD_TEAMS + SUCCESS,
      payload: teams,
    });
  } catch {
    dispatch({
      type: LOAD_TEAMS + FAILURE,
    });
  }
};

export { loadTeams };
