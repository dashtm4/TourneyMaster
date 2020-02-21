import api from 'api/api';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { getVarcharEight } from 'helpers';
import { Toasts } from 'components/common';
import { ITeam } from 'common/models';
import { History } from 'history';

export const saveTeams: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (teams: Partial<ITeam>[], history: History) => async (
  _dispatch,
  getState
) => {
  const {
    event: {
      data: { event_id },
    },
  }: any = getState();

  for await (const team of teams) {
    const data = {
      ...team,
      event_id,
      team_id: getVarcharEight(),
    };
    const response = await api.post(`/teams`, data);

    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't create a team");
    }
  }

  history.goBack();

  Toasts.successToast('Team is successfully created');
};
