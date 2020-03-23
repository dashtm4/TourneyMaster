import { ITeamCard } from 'common/models/schedule/teams';
import { Dispatch } from 'redux';
import { SCHEDULES_TABLE_FILL } from './actionTypes';

const fillSchedulesTableAction = (payload: ITeamCard[]) => ({
  type: SCHEDULES_TABLE_FILL,
  payload,
});

export const fillSchedulesTable = (teamCards: ITeamCard[]) => (
  dispatch: Dispatch
) => {
  dispatch(fillSchedulesTableAction(teamCards));
};
