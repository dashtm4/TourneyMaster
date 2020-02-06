import { combineReducers } from 'redux';
import user from './user';
import facilitiesReducer from '../components/facilities/logic/reducer';

const rootReducer = combineReducers({
  user,
  facilities: facilitiesReducer,
});

export default rootReducer;
