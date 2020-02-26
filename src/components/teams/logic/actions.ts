import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  TeamsAction,
  SUCCESS,
  FAILURE,
  CHANGE_POOL,
  LOAD_DIVISIONS,
  LOAD_POOLS_START,
  LOAD_POOLS_SUCCESS,
  LOAD_POOLS_FAILURE,
  LOAD_TEAMS_START,
  LOAD_TEAMS_SUCCESS,
  LOAD_TEAMS_FAILURE,
  EDIT_TEAM,
  DELETE_TEAM,
} from './action-types';
import { ITeam } from '../../../common/models';
import Api from 'api/api';

const changePool = (team: ITeam, poolId: string | null) => {
  const changedTeam = { ...team, pool_id: poolId, isChange: true };

  return {
    type: CHANGE_POOL,
    payload: changedTeam,
  };
};

const loadDivisions: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  eventId: string
) => async (dispatch: Dispatch) => {
  try {
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);

    dispatch({
      type: LOAD_DIVISIONS + SUCCESS,
      payload: divisions,
    });
  } catch {
    dispatch({
      type: LOAD_DIVISIONS + FAILURE,
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

const loadTeams: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  divisionId: string
) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_TEAMS_START,
      payload: {
        divisionId,
      },
    });

    const teams = await Api.get(`/teams?division_id=${divisionId}`);

    dispatch({
      type: LOAD_TEAMS_SUCCESS,
      payload: {
        divisionId,
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
  team: ITeam
) => async (dispatch: Dispatch) => {
  try {
    await Api.delete(`/teams?team_id=${team.team_id}`);

    dispatch({
      type: DELETE_TEAM + SUCCESS,
      payload: team,
    });
  } catch {
    dispatch({
      type: DELETE_TEAM + FAILURE,
    });
  }
};

export {
  changePool,
  loadDivisions,
  loadPools,
  loadTeams,
  editTeam,
  deleteTeam,
};
