import { Store, createStore } from 'redux';
import { provideReduxForms } from '@angular-redux/form';

import { AppState } from './model';
import rootReducer from './modules/reducers';

const storeInstance: Store<AppState> = createStore(rootReducer);

provideReduxForms(storeInstance);

export { storeInstance };