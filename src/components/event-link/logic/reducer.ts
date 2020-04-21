import { DATA_FETCH_SUCCESS } from './actionTypes';
import { IDivision, IEventDetails, IPool, IField, ITeam } from 'common/models';

export interface IState {
  data: {
    events: IEventDetails[];
    divisions: IDivision[];
    pools: IPool[];
    fields: IField[];
    teams: ITeam[];
  };
}

const defaultState: IState = {
  data: {
    events: [],
    divisions: [],
    pools: [],
    fields: [],
    teams: [],
  },
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case DATA_FETCH_SUCCESS: {
      return { ...state, data: Object.assign(state.data, action.payload) };
    }
    default:
      return state;
  }
};
