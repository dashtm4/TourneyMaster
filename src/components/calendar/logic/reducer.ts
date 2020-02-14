import {
  CalendarEventActions,
  CALENDAR_EVENT_FETCH_MULT,
  CALENDAR_EVENT_CREATE_SUCC,
} from './actionTypes';
import { ICalendarEvent } from 'common/models/calendar';

interface IAppState {
  events: ICalendarEvent[] | null | undefined;
  eventJustCreated: boolean;
  error: boolean;
}

const appState: IAppState = {
  events: undefined,
  eventJustCreated: false,
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

    default:
      return state;
  }
};
