import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  TeamsAction,
  SUCCESS,
  FAILURE,
  LOAD_DIVISIONS,
  LOAD_POOLS,
  LOAD_TEAMS,
  CHANGE_POOL,
} from './action-types';
import { IPool, ITeam } from '../../../common/models';
import Api from 'api/api';

import { mockPools } from '../mocks/pools';
import { mockTeams } from '../mocks/teams';

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
    // const teams = await Api.get(`/teams?event_id=${eventId}`);
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

const changePool = (team: ITeam, poolId: string | null) => {
  const changedTeam = { ...team, pool_id: poolId, isChange: true };

  return {
    type: CHANGE_POOL,
    payload: changedTeam,
  };
};

export { loadDivisions, loadPools, loadTeams, changePool };
