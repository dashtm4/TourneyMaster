import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from '../browserhistory';

import facilities from 'components/facilities/logic/reducer';
import event from 'components/event-details/logic/reducer';
import events from 'components/dashboard/logic/reducer';
import registration from '../components/registration/registration-edit/logic/reducer';
import divisions from 'components/divisions-and-pools/logic/reducer';
import calendar from 'components/calendar/logic/reducer';
import scoring from 'components/scoring/logic/reducer';
import scheduling from 'components/scheduling/logic/reducer';
import teams from 'components/teams/logic/reducer';
import recordScores from 'components/scoring/pages/record-scores/logic/reducer';

const rootReducer = combineReducers({
  router: connectRouter(history),
  facilities,
  event,
  events,
  registration,
  divisions,
  calendar,
  scoring,
  recordScores,
  scheduling,
  teams,
});

export default rootReducer;
