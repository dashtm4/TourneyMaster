import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import * as Yup from 'yup';
import { IAppState } from 'reducers/root-reducer.types';
import Api from 'api/api';
import { teamSchema } from 'validations';
import { mapScheduleGamesWithNames, getVarcharEight } from 'helpers';
import history from 'browserhistory';
import { ScheduleStatuses } from 'common/enums';
import { ITeam, IDivision, IFacility, ISchedule } from 'common/models';
import { Toasts } from 'components/common';
import {
  TeamsAction,
  LOAD_TEAMS_DATA_START,
  LOAD_TEAMS_DATA_SUCCESS,
  LOAD_TEAMS_DATA_FAILURE,
  LOAD_POOLS_START,
  LOAD_POOLS_SUCCESS,
  LOAD_POOLS_FAILURE,
  SAVE_TEAMS_SUCCESS,
  SAVE_TEAMS_FAILURE,
  CREATE_TEAMS_SUCCESS,
} from './action-types';
import { ITeamsRegister } from 'common/models/register';

const loadTeamsData: ActionCreator<ThunkAction<void, {}, null, TeamsAction>> = (
  eventId: string
) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_TEAMS_DATA_START,
    });

    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const fields = (
      await Promise.all(
        facilities.map((it: IFacility) =>
          Api.get(`/fields?facilities_id=${it.facilities_id}`)
        )
      )
    ).flat();
    const schedules = await Api.get(`/schedules?event_id=${eventId}`);
    const publishedSchedule = schedules.find(
      (it: ISchedule) => it.is_published_YN === ScheduleStatuses.Published
    );

    const schedulesGames = publishedSchedule
      ? await Api.get(`/games?schedule_id=${publishedSchedule.schedule_id}`)
      : [];

    const mappedGames = mapScheduleGamesWithNames(
      teams,
      fields,
      schedulesGames
    );

    dispatch({
      type: LOAD_TEAMS_DATA_SUCCESS,
      payload: {
        divisions,
        teams,
        games: mappedGames,
      },
    });
  } catch {
    dispatch({
      type: LOAD_TEAMS_DATA_FAILURE,
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

const saveTeams = (teams: ITeam[]) => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  try {
    const { divisions } = getState().teams;

    for await (let division of divisions) {
      await Yup.array()
        .of(teamSchema)
        .unique(
          team => team.long_name,
          'Oops. It looks like you already have team with the same long name. The team must have a unique long name.'
        )
        .validate(
          teams.filter(team => team.division_id === division.division_id)
        );
    }

    for await (let team of teams) {
      if (team.isDelete) {
        await Api.delete(`/teams?team_id=${team.team_id}`);
        // Remove connection from registrants
        let registrants = await Api.get(
          `/reg_responses_teams?team_id=${team.team_id}`
        );
        if (registrants.length > 0) {
          registrants = registrants.map((registrant: ITeamsRegister) => ({
            ...registrant,
            team_id: null,
          }));
          await Api.put(`/reg_responses_teams`, registrants);
        }
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

export { loadTeamsData, loadPools, saveTeams };

export const createTeams: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (teams: Partial<ITeam>[], eventId: string) => async () => {
  try {
    const allTeams = await Api.get(`/teams?event_id=${eventId}`);
    const mappedDivisionTeams = Object.values(
      [...allTeams, ...teams].reduce((acc, it: ITeam) => {
        const divisionId = it.division_id;
        const mappedTeam = {
          ...it,
          phone_num: it.phone_num ? it.phone_num : '',
        };

        acc[divisionId] = [...(acc[divisionId] || []), mappedTeam];

        return acc;
      }, {})
    );

    for await (let mappedTeams of mappedDivisionTeams) {
      await Yup.array()
        .of(teamSchema)
        .unique(
          team => team.long_name,
          'Oops. It looks like you already have team with the same long name. The team must have a unique long name.'
        )
        .validate(mappedTeams);
    }

    for await (const team of teams) {
      const data = {
        ...team,
        event_id: eventId,
        team_id: getVarcharEight(),
      };

      const response = await Api.post(`/teams`, data);

      if (response?.errorType === 'Error' || response?.message === false) {
        return Toasts.errorToast("Couldn't create a team");
      }
    }

    history.goBack();

    Toasts.successToast('The Team(s) have been successfully created!');
  } catch (err) {
    Toasts.errorToast(err.message);
  }
};

export const createTeamsCsv: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (teams: Partial<ITeam>[], cb: (param?: object) => void) => async (
  dispatch: Dispatch
) => {
  const allDivisions = await Api.get(
    `/divisions?event_id=${teams[0].event_id}`
  );
  const allTeams = await Api.get(`/teams?event_id=${teams[0].event_id}`);

  for (const [index, team] of teams.entries()) {
    if (!team.division_id) {
      return Toasts.errorToast(
        `Record ${index + 1}: Division Name is required to fill!`
      );
    }
  }

  const data = teams.map(team => {
    const divisionId = allDivisions.find(
      (div: IDivision) =>
        div.long_name.toLowerCase() === team.division_id?.toLowerCase()
    )?.division_id;

    if (team.phone_num) {
      const orgin: any = team.phone_num;
      const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
      let str = orgin.replace(regex, '');
      str = str.replace(/\s/g, '');

      if (str && str.indexOf('1') === 0) {
        str = str.substring(1);
      }

      team.phone_num = str;
    } else {
      team.phone_num = '';
    }

    return { ...team, division_id: divisionId };
  });

  const dupList = [];

  for (const [index, team] of data.entries()) {
    if (!team.division_id) {
      return Toasts.errorToast(
        `Record ${index +
          1}: There is no division with such long name. Please, create a division first or choose another one.`
      );
    }
    const teamsInDivision = allTeams.filter(
      (t: ITeam) => t.division_id === team.division_id
    );

    try {
      await Yup.array()
        .of(teamSchema)
        .unique(t => t.long_name, 'The team must have a unique long name.')
        .validate([...teamsInDivision, team]);
    } catch (err) {
      if (err.value) {
        const invalidTeam = err.value[err.value.length - 1];
        const index = teams.findIndex(
          team => team.team_id === invalidTeam.team_id
        );

        dupList.push({
          index,
          msg: err.message,
        });
      }
    }

    allTeams.push(team);
  }

  if (dupList.length !== 0) {
    cb({ type: 'error', data: dupList });
  } else {
    for (const team of data) {
      const response = await Api.post(`/teams`, team);
      if (response?.errorType === 'Error' || response?.message === false) {
        return Toasts.errorToast("Couldn't create a team");
      }
    }

    dispatch({
      type: CREATE_TEAMS_SUCCESS,
      payload: {
        data,
      },
    });

    cb();

    const successMsg = `Teams are successfully created (${data.length})`;
    Toasts.successToast(successMsg);
  }
};
