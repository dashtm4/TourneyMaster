import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as Yup from 'yup';
import api from 'api/api';
import { teamSchema } from 'validations';
import { getVarcharEight } from 'helpers';
import { Toasts } from 'components/common';
import { ITeam } from 'common/models';
import { History } from 'history';

export const saveTeams: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (
  teams: Partial<ITeam>[],
  eventId: string,
  history: History
) => async () => {
  try {
    const allTeams = await api.get(`/teams?event_id=${eventId}`);
    const mappedDivisionTeams = Object.values(
      [...allTeams, ...teams].reduce((acc, it: ITeam) => {
        const divisionId = it.division_id;

        if (divisionId) {
          acc[divisionId] = [...(acc[divisionId] || []), it];
        } else {
          acc['unassigned'] = [...(acc['unassigned'] || []), it];
        }

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
        .unique(
          team => team.short_name,
          'Oops. It looks like you already have team with the same short name. The team must have a unique short name.'
        )
        .validate(mappedTeams);
    }

    for await (const team of teams) {
      const data = {
        ...team,
        event_id: eventId,
        team_id: getVarcharEight(),
      };

      const response = await api.post(`/teams`, data);

      if (response?.errorType === 'Error') {
        return Toasts.errorToast("Couldn't create a team");
      }
    }

    history.goBack();

    Toasts.successToast('Team is successfully created');
  } catch (err) {
    Toasts.errorToast(err.message);
  }
};
