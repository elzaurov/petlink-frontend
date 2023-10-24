import { combineReducers } from 'redux';
import authenticateReducer from './auth/reducer';
import adminReducer from './admin/reducer';
import customerReducer from './customer/reducer';

const rootReducer = combineReducers({
  auth: authenticateReducer,
  admin: adminReducer,
  customer: customerReducer,
});

export default rootReducer;
