import { combineReducers } from 'redux';
import photosReducer from './photos';
import setUser from './setUser';

const allReducers = combineReducers({
  photos: photosReducer, 
  setUser: setUser
});

export default allReducers;