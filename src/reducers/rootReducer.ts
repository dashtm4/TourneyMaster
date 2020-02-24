import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from '../browserhistory';

import facilities from 'components/facilities/logic/reducer';
import event from 'components/event-details/logic/reducer';
import events from 'components/dashboard/logic/reducer';
import registration from 'components/registration-edit/logic/reducer';
import divisions from 'components/divisions-and-pools/logic/reducer';
import division from '../components/divisions-and-pools/add-division/add-division-form/logic/reducer';
import calendar from 'components/calendar/logic/reducer';
import scoring from 'components/scoring/logic/reducer';
import scheduling from 'components/scheduling/logic/reducer';
import teams from 'components/teams/logic/reducer';

const rootReducer = combineReducers({
  router: connectRouter(history),
  facilities,
  event,
  events,
  registration,
  divisions,
  division,
  calendar,
  scoring,
  scheduling,
  teams,
});

export default rootReducer;
