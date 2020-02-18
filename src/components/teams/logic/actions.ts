import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  TeamsAction,
  SUCCESS,
  FAILURE,
  LOAD_DIVISIONS,
  LOAD_POOLS,
} from './action-types';
import { IDisision, IPool, ITeam } from '../../../common/models';
import Api from 'api/api';

import { mockPools } from '../mocks/pools';
import { mockTeams } from '../mocks/teams';

const loadDivisions: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  eventId: string
) => async (dispatch: Dispatch) => {
  try {
    const divisions = await Api.get('/divisions');
    const currentEventDivisions = divisions.filter(
      (it: IDisision) => it.event_id === eventId
    );

    dispatch({
      type: LOAD_DIVISIONS + SUCCESS,
      payload: currentEventDivisions,
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
    // const poolsAPP = await Api.get(`/pools?division_id=${divisionId}`);
    const pools = mockPools;

    const currentDivisionPools = pools.filter(
      (it: IPool) => it.division_id === divisionId
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
  poolId: string
) => async (dispatch: Dispatch) => {
  try {
    // const pools = await Api.get(`/teams?pool_id=${poolId}`);
    const teams = mockTeams;

    const currentPoolTeams = teams.filter((it: ITeam) => it.pool_id === poolId);

    dispatch({
      type: LOAD_POOLS + SUCCESS,
      payload: currentPoolTeams,
    });
  } catch {
    dispatch({
      type: LOAD_POOLS + FAILURE,
    });
  }
};

export { loadDivisions, loadPools, loadTeams };
