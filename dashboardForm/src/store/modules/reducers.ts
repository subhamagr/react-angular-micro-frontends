import { combineReducers } from 'redux';
import { composeReducers, defaultFormReducer } from '@angular-redux/form';

import { AppState } from '../model';
import formState from './formState';

export const rootReducer = composeReducers(
  defaultFormReducer(),
  combineReducers<AppState>({
    formState,
  }));

export default rootReducer;
