import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import * as Yup from 'yup';
import {
  TeamsAction,
  LOAD_DIVISIONS_TEAMS_START,
  LOAD_DIVISIONS_TEAMS_SUCCESS,
  LOAD_DIVISIONS_TEAMS_FAILURE,
  LOAD_POOLS_START,
  LOAD_POOLS_SUCCESS,
  LOAD_POOLS_FAILURE,
  SAVE_TEAMS_SUCCESS,
  SAVE_TEAMS_FAILURE,
} from './action-types';
import Api from 'api/api';
import { teamSchema } from 'validations';
import { Toasts } from 'components/common';
import { ITeam } from 'common/models';

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
        teams,
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

const saveTeams: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  teams: ITeam[]
) => async (dispatch: Dispatch) => {
  try {
    await Yup.array()
      .of(teamSchema)
      .unique(
        team => team.long_name,
        'Oops. It looks like you already have team with the same long name. The team must have a unique long name.'
      )
      .unique(
        team => team.short_name,
        'Oops. It looks like you already have team with the same short name. The team must have a unique short name.'
      )
      .validate(teams);

    for await (let team of teams) {
      if (team.isDelete) {
        await Api.delete(`/teams?team_id=${team.team_id}`);
      }

      if (team.isChange && !team.isDelete) {
        delete team.isChange;

        await Api.put(`/teams?team_id=${team.team_id}`, team);
      }
    }

    dispatch({
      type: SAVE_TEAMS_SUCCESS,
      payload: {
        teams,
      },
    });

    Toasts.successToast('Teams saved successfully');
  } catch (err) {
    dispatch({
      type: SAVE_TEAMS_FAILURE,
    });

    Toasts.errorToast(err.message);
  }
};

export { loadDivisionsTeams, loadPools, saveTeams };
