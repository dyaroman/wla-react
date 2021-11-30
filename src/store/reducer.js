import { combineReducers } from 'redux';

import { tableReducer } from '../features/table/table.reducer';

export const rootReducer = combineReducers({
  table: tableReducer,
});
