import { Store, createStore } from 'redux';

import { AppState } from './model';
import rootReducer from './modules/reducers';

const storeInstance: Store<AppState> = createStore(rootReducer);

export { storeInstance };