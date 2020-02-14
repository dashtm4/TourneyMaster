import { CalendarEventActions, CALENDAR_EVENT_FETCH_MULT } from './actionTypes';
import { IEvent } from 'common/models/calendar';

interface AppState {
  events: IEvent[] | null | undefined;
  error: boolean;
}

const appState: AppState = {
  events: undefined,
  error: false,
};

export default (state = appState, action: CalendarEventActions) => {
  switch (action.type) {
    case CALENDAR_EVENT_FETCH_MULT:
      return {
        ...state,
        error: false,
        events: action.payload,
      };

    default:
      return state;
  }
};
