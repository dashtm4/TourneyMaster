import { AnyAction } from 'redux';
import { ITeamCard } from 'common/models/schedule/teams';
import {
  SCHEDULES_TABLE_FILL,
  SCHEDULES_TABLE_UNDO,
  SCHEDULES_TABLE_UPDATE,
  SCHEDULES_TABLE_CLEAR,
  FILL_GAMES_LIST,
  CLEAR_GAMES_LIST,
} from './actionTypes';
import { SCHEDULES_DRAFT_SAVED_SUCCESS } from '../actionTypes';
import { IConfigurableGame } from 'components/common/matrix-table/helper';

export interface ISchedulesTableState {
  previous: (ITeamCard[] | undefined)[];
  current?: ITeamCard[];
  gamesList: IConfigurableGame[];
}

const initialState: ISchedulesTableState = {
  previous: [],
  current: undefined,
  gamesList: [],
};

const SchedulesTableReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SCHEDULES_TABLE_FILL:
      return {
        ...state,
        previous: [...(state.previous || []), state.current],
        current: action.payload,
      };
    case SCHEDULES_TABLE_UNDO:
      return {
        ...state,
        previous: state.previous.slice(0, state.previous.length - 1),
        current: state.previous[state.previous.length - 1],
      };
    case SCHEDULES_TABLE_UPDATE:
      return {
        ...state,
        current: state.current!.map(team =>
          team!.id === action.payload.id ? action.payload : team
        ),
      };
    case SCHEDULES_TABLE_CLEAR:
      return {
        ...state,
        previous: [],
        current: undefined,
      };
    case SCHEDULES_DRAFT_SAVED_SUCCESS:
      return {
        ...state,
        previous: [],
      };
    case FILL_GAMES_LIST:
      return {
        ...state,
        gamesList: action.payload,
      };
    case CLEAR_GAMES_LIST:
      return {
        ...state,
        gamesList: [],
      }
    default:
      return state;
  }
};

export default SchedulesTableReducer;
