import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import * as Yup from 'yup';
import {
  TeamsAction,
  LOAD_SCORING_DATA_START,
  LOAD_SCORING_DATA_SUCCESS,
  LOAD_SCORING_DATA_FAILURE,
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
import { IAppState } from 'reducers/root-reducer.types';
import Api from 'api/api';
import { teamSchema } from 'validations';
import { mapScheduleGamesWithNames } from 'helpers';
import { ITeam, ISchedule, ScheduleStatuses } from 'common/models';
import { Toasts } from 'components/common';

const loadScoringData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  TeamsAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_SCORING_DATA_START,
    });

    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const schedules = await Api.get(`/schedules?event_id=${eventId}`);
    const publishedSchedule = schedules.find(
      (it: ISchedule) => it.schedule_status === ScheduleStatuses.PUBLISHED
    );

    const schedulesGames = await Api.get(
      `/games?schedule_id=${publishedSchedule.schedule_id}`
    );

    const mappedGames = await mapScheduleGamesWithNames(
      eventId,
      schedulesGames
    );

    dispatch({
      type: LOAD_SCORING_DATA_SUCCESS,
      payload: {
        divisions,
        games: mappedGames,
      },
    });
  } catch {
    dispatch({
      type: LOAD_SCORING_DATA_FAILURE,
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

const editTeam = (team: ITeam) => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  try {
    const { teams } = getState().scoring;

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
      .validate(
        teams.reduce((acc, it) => {
          if (it.team_id === team.team_id) {
            return [...acc, team];
          }

          return it.division_id === team.division_id ? [...acc, it] : acc;
        }, [] as ITeam[])
      );

    await Api.put(`/teams?team_id=${team.team_id}`, team);

    dispatch({
      type: EDIT_TEAM_SUCCESS,
      payload: {
        team,
      },
    });

    Toasts.successToast('Teams saved successfully');
  } catch (err) {
    dispatch({
      type: EDIT_TEAM_FAILURE,
    });

    Toasts.errorToast(err.message);
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

export { loadScoringData, loadPools, loadTeams, editTeam, deleteTeam };
