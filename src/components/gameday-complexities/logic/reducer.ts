import { EventDetailsDTO } from 'components/event-details/logic/model';
import {
  EVENTS_FETCH_SUCCESS,
  FACILITIES_FETCH_SUCCESS,
  FIELDS_FETCH_SUCCESS,
} from './actionTypes';
import { IFacility, IField } from 'common/models';

export interface IState {
  data?: EventDetailsDTO[];
  facilities: IFacility[];
  fields: IField[];
}

const defaultState: IState = {
  data: [],
  facilities: [],
  fields: [],
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case EVENTS_FETCH_SUCCESS: {
      return {
        ...state,
        data: action.payload.sort(
          (a: EventDetailsDTO, b: EventDetailsDTO) =>
            +new Date(b.event_startdate) - +new Date(a.event_startdate)
        ),
      };
    }
    case FACILITIES_FETCH_SUCCESS: {
      return {
        ...state,
        facilities: action.payload,
      };
    }
    case FIELDS_FETCH_SUCCESS: {
      return {
        ...state,
        fields: action.payload,
      };
    }
    default:
      return state;
  }
};
