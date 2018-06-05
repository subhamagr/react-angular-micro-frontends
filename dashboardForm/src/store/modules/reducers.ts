import { combineReducers } from 'redux';

import { AppState } from '../model';
import formState from './formState';

export const rootReducer = combineReducers<AppState>({
  formState,
});

export default rootReducer;
