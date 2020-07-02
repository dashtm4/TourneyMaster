import { ITeamCard } from 'common/models/schedule/teams';
import { Dispatch } from 'redux';
import {
  SCHEDULES_TABLE_FILL,
  SCHEDULES_TABLE_UPDATE,
  SCHEDULES_TABLE_UNDO,
  SCHEDULES_TABLE_CLEAR,
  FILL_GAMES_LIST,
  CLEAR_GAMES_LIST,
} from './actionTypes';
import { IConfigurableGame } from 'components/common/matrix-table/helper';

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

const schedulesTableClear = () => ({
  type: SCHEDULES_TABLE_CLEAR,
});

const fillGamesListAction = (gamesList: IConfigurableGame[]) => ({
  type: FILL_GAMES_LIST,
  payload: gamesList,
});

const clearGamesListAction = () => ({
  type: CLEAR_GAMES_LIST,
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

export const clearSchedulesTable = () => (dispatch: Dispatch) => {
  dispatch(schedulesTableClear());
};

export const fillGamesList = (gamesList: IConfigurableGame[]) => (dispatch: Dispatch) => {
  dispatch(fillGamesListAction(gamesList));
};

export const clearGamesList = () => (dispatch: Dispatch) => {
  dispatch(clearGamesListAction());
};
