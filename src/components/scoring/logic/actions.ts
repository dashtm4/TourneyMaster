import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  TeamsAction,
  SUCCESS,
  FAILURE,
  LOAD_DIVISION,
  LOAD_POOLS,
  LOAD_TEAMS,
  EDIT_TEAM,
  DELETE_TEAM,
} from './action-types';
import { IDisision, IPool, ITeam } from '../../../common/models';
import Api from 'api/api';

const loadDivision: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  eventId: string
) => async (dispatch: Dispatch) => {
  try {
    const divisions = await Api.get('/divisions');
    const currentEventDivisions = divisions.filter(
      (it: IDisision) => it.event_id === eventId
    );

    dispatch({
      type: LOAD_DIVISION + SUCCESS,
      payload: currentEventDivisions,
    });
  } catch {
    dispatch({
      type: LOAD_DIVISION + FAILURE,
    });
  }
};

const loadPools: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  divisionId: string
) => async (dispatch: Dispatch) => {
  try {
    const pools = await Api.get('/pools');
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

const loadTeams: ActionCreator<ThunkAction<
  void,
  {},
  null,
  TeamsAction
>> = () => async (dispatch: Dispatch) => {
  try {
    const teams = await Api.get('/teams');

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
  teamId: string
) => async (dispatch: Dispatch) => {
  try {
    await Api.delete(`/teams?team_id=${teamId}`);

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

export { loadDivision, loadPools, loadTeams, editTeam, deleteTeam };
