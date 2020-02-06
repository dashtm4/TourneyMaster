import { combineReducers } from 'redux';
import user from './user';
import event from 'components/event-details/logic/reducer';

const rootReducer = combineReducers({
  user,
  event,
});

export default rootReducer;
