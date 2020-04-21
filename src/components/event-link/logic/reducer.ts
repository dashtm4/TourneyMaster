import { DATA_FETCH_SUCCESS, MESSAGES_FETCH_SUCCESS } from './actionTypes';
import { IDivision, IEventDetails, IPool, IField, ITeam } from 'common/models';

export interface IState {
  data: {
    events: IEventDetails[];
    divisions: IDivision[];
    pools: IPool[];
    fields: IField[];
    teams: ITeam[];
  };
  messages: any[];
  messagesAreLoading: boolean;
}

const defaultState: IState = {
  data: {
    events: [],
    divisions: [],
    pools: [],
    fields: [],
    teams: [],
  },
  messages: [],
  messagesAreLoading: true,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case DATA_FETCH_SUCCESS: {
      return { ...state, data: Object.assign(state.data, action.payload) };
    }
    case MESSAGES_FETCH_SUCCESS: {
      return { ...state, messages: action.payload, messagesAreLoading: false };
    }
    default:
      return state;
  }
};
