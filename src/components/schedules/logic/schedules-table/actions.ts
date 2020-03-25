import { ITeamCard } from 'common/models/schedule/teams';
import { Dispatch } from 'redux';
import { SCHEDULES_TABLE_FILL, SCHEDULES_TABLE_UPDATE } from './actionTypes';

const fillSchedulesTableAction = (payload: ITeamCard[]) => ({
  type: SCHEDULES_TABLE_FILL,
  payload,
});

const updateScheduleTableAction = (payload: ITeamCard) => ({
  type: SCHEDULES_TABLE_UPDATE,
  payload,
});

export const fillSchedulesTable = (teamCards: ITeamCard[]) => (
  dispatch: Dispatch
) => {
  dispatch(fillSchedulesTableAction(teamCards));
};

export const updateSchedulesTable = (teamCard: ITeamCard) => (
  dispatch: Dispatch
) => {
  dispatch(updateScheduleTableAction(teamCard));
};
