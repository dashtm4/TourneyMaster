import { combineReducers } from 'redux';
import user from './user';
import facilitiesReducer from '../components/facilities/logic/reducer';
import event from 'components/event-details/logic/reducer';
import events from '../components/dashboard/logic/reducer';
import registration from '../components/registration-edit/logic/reducer';

const rootReducer = combineReducers({
  user,
  facilities: facilitiesReducer,
  event,
  events,
  registration,
});

export default rootReducer;
