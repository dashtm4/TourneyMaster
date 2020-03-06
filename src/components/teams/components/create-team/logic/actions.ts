import api from 'api/api';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
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
    for await (const team of teams) {
      const data = {
        ...team,
        event_id: eventId,
        team_id: getVarcharEight(),
      };

      await teamSchema.validate(team);

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
