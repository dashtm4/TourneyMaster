import {
  CalendarEventActions,
  CALENDAR_EVENT_FETCH_MULT,
  CALENDAR_EVENT_CREATE_SUCC,
  GET_TAGS_SUCCESS,
} from './actionTypes';
import { ICalendarEvent } from 'common/models/calendar';
import ITag from 'common/models/calendar/tag';

interface IAppState {
  events: ICalendarEvent[] | null | undefined;
  eventJustCreated: boolean;
  error: boolean;
  tags: ITag[];
}

const appState: IAppState = {
  events: undefined,
  eventJustCreated: false,
  tags: [],
  error: false,
};

export default (state = appState, action: CalendarEventActions): IAppState => {
  switch (action.type) {
    case CALENDAR_EVENT_FETCH_MULT:
      return {
        ...state,
        error: false,
        eventJustCreated: false,
        events: action.payload,
      };

    case CALENDAR_EVENT_CREATE_SUCC:
      return {
        ...state,
        error: false,
        eventJustCreated: true,
      };
    case GET_TAGS_SUCCESS:
      return {
        ...state,
        tags: action.payload,
      };

    default:
      return state;
  }
};
