import { combineReducers } from 'redux';

import facilities from 'components/facilities/logic/reducer';
import event from 'components/event-details/logic/reducer';
import events from 'components/dashboard/logic/reducer';
import registration from 'components/registration-edit/logic/reducer';
import divisions from 'components/divisions-and-pools/logic/reducer';
import calendar from 'components/calendar/logic/reducer';
import scoring from 'components/scoring/logic/reducer';
import teams from 'components/teams/logic/reducer';

const rootReducer = combineReducers({
  facilities,
  event,
  events,
  registration,
  divisions,
  calendar,
  scoring,
  teams,
});

export default rootReducer;
