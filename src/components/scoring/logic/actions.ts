import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  TeamsAction,
  SUCCESS,
  FAILURE,
  LOAD_DIVISION,
  LOAD_TEAMS,
  EDIT_TEAM,
  DELETE_TEAM,
} from './action-types';
import { IDisision, ITeam } from '../../../common/models';
import Api from 'api/api';

import { teams } from '../mocks/teams';

const loadDivision: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  eventId: string
) => async (dispatch: Dispatch) => {
  try {
    const divisions = await Api.get('/divisions');
    const currentDivision = divisions.find(
      (it: IDisision) => it.event_id === eventId
    );

    dispatch({
      type: LOAD_DIVISION + SUCCESS,
      payload: currentDivision,
    });
  } catch {
    dispatch({
      type: LOAD_DIVISION + FAILURE,
    });
  }
};

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

const editTeam: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  team: ITeam
) => async (dispatch: Dispatch) => {
  try {
    // await Api.put('');

    dispatch({
      type: EDIT_TEAM + SUCCESS,
      payload: team,
    });
  } catch {
    dispatch({
      type: EDIT_TEAM + FAILURE,
    });
  }
};

const deleteTeam: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  teamId: string
) => async (dispatch: Dispatch) => {
  try {
    // await Api.delete('');

    dispatch({
      type: DELETE_TEAM + SUCCESS,
      payload: teamId,
    });
  } catch {
    dispatch({
      type: DELETE_TEAM + FAILURE,
    });
  }
};

export { loadDivision, loadTeams, editTeam, deleteTeam };
