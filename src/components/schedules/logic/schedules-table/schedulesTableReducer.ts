import { AnyAction } from 'redux';
import { ITeamCard } from 'common/models/schedule/teams';
import { SCHEDULES_TABLE_FILL, SCHEDULES_TABLE_UNDO } from './actionTypes';

export interface ISchedulesTableState {
  previous: (ITeamCard[] | undefined)[];
  current?: ITeamCard[];
}

const initialState: ISchedulesTableState = {
  previous: [],
  current: undefined,
};

const SchedulesTableReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SCHEDULES_TABLE_FILL:
      return {
        ...state,
        previous: [...state.previous, action.payload],
        current: action.payload,
      };
    case SCHEDULES_TABLE_UNDO:
      return {
        ...state,
        previous: state.previous.slice(0, state.previous.length - 2),
        current: state.previous[state.previous.length - 1],
      };
    default:
      return state;
  }
};

export default SchedulesTableReducer;
