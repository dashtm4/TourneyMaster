import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  TeamsAction,
  CHANGE_POOL,
  LOAD_DIVISIONS_TEAMS_START,
  LOAD_DIVISIONS_TEAMS_SUCCESS,
  LOAD_DIVISIONS_TEAMS_FAILURE,
  LOAD_POOLS_START,
  LOAD_POOLS_SUCCESS,
  LOAD_POOLS_FAILURE,
  EDIT_TEAM_SUCCESS,
  EDIT_TEAM_FAILURE,
  DELETE_TEAM_SUCCESS,
  DELETE_TEAM_FAILURE,
} from './action-types';
import { ITeam } from '../../../common/models';
import Api from 'api/api';

const changePool = (team: ITeam, poolId: string | null) => {
  const changedTeam = { ...team, pool_id: poolId, isChange: true };

  return {
    type: CHANGE_POOL,
    payload: {
      changedTeam,
    },
  };
};

const loadDivisionsTeams: ActionCreator<ThunkAction<
  void,
  {},
  null,
  TeamsAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_DIVISIONS_TEAMS_START,
    });

    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);

    dispatch({
      type: LOAD_DIVISIONS_TEAMS_SUCCESS,
      payload: {
        divisions,
        teams
      },
    });
  } catch {
    dispatch({
      type: LOAD_DIVISIONS_TEAMS_FAILURE,
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
  } catch {
    dispatch({
      type: EDIT_TEAM_FAILURE,
    });
  }
};

const deleteTeam: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  team: ITeam
) => async (dispatch: Dispatch) => {
  try {
    await Api.delete(`/teams?team_id=${team.team_id}`);

    dispatch({
      type: DELETE_TEAM_SUCCESS,
      payload: {
        team,
      },
    });
  } catch {
    dispatch({
      type: DELETE_TEAM_FAILURE,
    });
  }
};

export {
  loadDivisionsTeams,
  changePool,
  loadPools,
  editTeam,
  deleteTeam,
};
