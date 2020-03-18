import {
  EVENTS_FETCH_SUCCESS,
  EVENTS_FETCH_FAILURE,
  DASHBOARD_TEAMS_FETCH_SUCCESS,
  FIELDS_FETCH_SUCCESS,
  DASHBOARD_FETCH_START,
} from './actionTypes';
import { EventDetailsDTO } from '../../event-details/logic/model';
import { ITeam, IField } from 'common/models';

export interface IState {
  data?: EventDetailsDTO[];
  teams: ITeam[];
  fields: IField[];
  isLoading: boolean;
  isDetailLoading: boolean;
  error: boolean;
}

const defaultState: IState = {
  data: [],
  teams: [],
  fields: [],
  isLoading: false,
  isDetailLoading: true,
  error: false,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case DASHBOARD_FETCH_START: {
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    }
    case EVENTS_FETCH_SUCCESS: {
      return {
        ...state,
        data: action.payload.sort(
          (a: EventDetailsDTO, b: EventDetailsDTO) =>
            +new Date(b.event_startdate) - +new Date(a.event_startdate)
        ),
        isLoading: false,
        error: false,
      };
    }
    case EVENTS_FETCH_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    }
    case DASHBOARD_TEAMS_FETCH_SUCCESS: {
      return {
        ...state,
        teams: action.payload,
        isDetailLoading: false,
        error: false,
      };
    }
    case FIELDS_FETCH_SUCCESS: {
      return {
        ...state,
        fields: action.payload,
        isDetailLoading: false,
        error: false,
      };
    }
    default:
      return state;
  }
};
