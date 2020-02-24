import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  TeamsAction,
  SUCCESS,
  FAILURE,
  CHANGE_POOL,
  LOAD_DIVISIONS,
  LOAD_POOLS,
  LOAD_TEAMS,
  EDIT_TEAM,
  DELETE_TEAM,
} from './action-types';
import { IPool, ITeam } from '../../../common/models';
import Api from 'api/api';

import { mockPools } from '../mocks/pools';
import { mockTeams } from '../mocks/teams';

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
  eventId: string
) => async (dispatch: Dispatch) => {
  try {
    // const poolsAPP = await Api.get(`/pools?event_id=${eventId}`);
    const pools = mockPools;

    const currentDivisionPools = pools.filter(
      (it: IPool) => it.event_id === eventId
    );

    dispatch({
      type: LOAD_POOLS + SUCCESS,
      payload: currentDivisionPools,
    });
  } catch {
    dispatch({
      type: LOAD_POOLS + FAILURE,
    });
  }
};

const loadTeams: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  eventId: string
) => async (dispatch: Dispatch) => {
  try {
    // const teamsAP = await Api.get(`/teams?event_id=${eventId}`);
    const teams = mockTeams;

    const currentEventTeams = teams.filter(
      (it: ITeam) => it.event_id === eventId
    );

    dispatch({
      type: LOAD_TEAMS + SUCCESS,
      payload: currentEventTeams,
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
    // await Api.put(`/teams?team_id=${team.team_id}`, team);

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
    // await Api.delete(`/teams?team_id=${team.team_id}`);

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
