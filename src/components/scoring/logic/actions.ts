import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  TeamsAction,
  LOAD_DIVISION_START,
  LOAD_DIVISION_SUCCESS,
  LOAD_DIVISION_FAILURE,
  LOAD_POOLS_START,
  LOAD_POOLS_SUCCESS,
  LOAD_POOLS_FAILURE,
  LOAD_TEAMS_START,
  LOAD_TEAMS_SUCCESS,
  LOAD_TEAMS_FAILURE,
  EDIT_TEAM_SUCCESS,
  EDIT_TEAM_FAILURE,
  DELETE_TEAM_SUCCESS,
  DELETE_TEAM_FAILURE,
} from './action-types';
import { ITeam } from '../../../common/models';
import { Toasts } from 'components/common';
import Api from 'api/api';

const loadDivision: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  eventId: string
) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_DIVISION_START,
    });

    const divisions = await Api.get(`/divisions?event_id=${eventId}`);

    dispatch({
      type: LOAD_DIVISION_SUCCESS,
      payload: {
        divisions,
      },
    });
  } catch {
    dispatch({
      type: LOAD_DIVISION_FAILURE,
    });
  }
};

const loadPools: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  divisionId: string
) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_POOLS_START,
      payload: {
        divisionId,
      },
    });

    const pools = await Api.get(`/pools?division_id=${divisionId}`);

    dispatch({
      type: LOAD_POOLS_SUCCESS,
      payload: {
        divisionId,
        pools,
      },
    });
  } catch {
    dispatch({
      type: LOAD_POOLS_FAILURE,
    });
  }
};

const loadTeams: ActionCreator<ThunkAction<
  void,
  {},
  null,
  TeamsAction
>> = poolId => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_TEAMS_START,
      payload: {
        poolId,
      },
    });

    const teams = await Api.get(`/teams?pool_id=${poolId}`);

    dispatch({
      type: LOAD_TEAMS_SUCCESS,
      payload: {
        poolId,
        teams,
      },
    });
  } catch {
    dispatch({
      type: LOAD_TEAMS_FAILURE,
    });
  }
};

const editTeam: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  team: ITeam
) => async (dispatch: Dispatch) => {
  try {
    await Api.put(`/teams?team_id=${team.team_id}`, team);

    dispatch({
      type: EDIT_TEAM_SUCCESS,
      payload: {
        team,
      },
    });

    Toasts.successToast('Saved');
  } catch {
    dispatch({
      type: EDIT_TEAM_FAILURE,
    });
  }
};

const deleteTeam: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  teamId: string
) => async (dispatch: Dispatch) => {
  try {
    await Api.delete(`/teams?team_id=${teamId}`);

    dispatch({
      type: DELETE_TEAM_SUCCESS,
      payload: {
        teamId,
      },
    });
  } catch {
    dispatch({
      type: DELETE_TEAM_FAILURE,
    });
  }
};

export { loadDivision, loadPools, loadTeams, editTeam, deleteTeam };
