import { ITeamCard } from 'common/models/schedule/teams';
import { Dispatch } from 'redux';
import {
  SCHEDULES_TABLE_FILL,
  SCHEDULES_TABLE_UPDATE,
  SCHEDULES_TABLE_UNDO,
} from './actionTypes';

const fillSchedulesTableAction = (payload: ITeamCard[]) => ({
  type: SCHEDULES_TABLE_FILL,
  payload,
});

const updateScheduleTableAction = (payload: ITeamCard) => ({
  type: SCHEDULES_TABLE_UPDATE,
  payload,
});

const scheduleUndo = () => ({
  type: SCHEDULES_TABLE_UNDO,
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

export const onScheduleUndo = () => (dispatch: Dispatch) => {
  dispatch(scheduleUndo());
};
