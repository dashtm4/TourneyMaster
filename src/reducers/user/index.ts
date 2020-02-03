import { Action } from 'redux';

type AppState = {};

const userReducer = (state: AppState = {}, action: Action): AppState => {
  switch (action.type) {
    /*
      Implement user fetch data actions
    */
    default:
      return state;
  }
};

export default userReducer;
