import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers.ts';

const storeEnhancers = applyMiddleware(thunkMiddleware);

const store = createStore(rootReducer, storeEnhancers);

export default store;