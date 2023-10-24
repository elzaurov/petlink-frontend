import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// create the Redux store with the saga middleware
const middleware = [sagaMiddleware];
if (import.meta.env.VITE_APP_ENV === 'local') {
  middleware.push(logger);
}

// Create the Redux store with the middleware
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

// run the root saga
sagaMiddleware.run(rootSaga);

export default store;
