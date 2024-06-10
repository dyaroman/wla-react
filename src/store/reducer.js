import { combineReducers } from 'redux';

import { appReducer } from '../features/app/app.reducer';
import { tableReducer } from '../features/table/table.reducer';
import { toastReducer } from '../features/toast/toast.reducer';

export const rootReducer = combineReducers({
  app: appReducer,
  table: tableReducer,
  toast: toastReducer,
});
