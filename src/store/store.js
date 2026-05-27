import { configureStore } from '@reduxjs/toolkit';

import { appReducer } from '../features/app/app.slice';
import { tableReducer } from '../features/table/table.slice';
import { toastReducer } from '../features/toast/toast.slice';
import { drawerReducer } from '../features/drawer/drawer.slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    table: tableReducer,
    toast: toastReducer,
    drawer: drawerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'table.websitesData',
          'table.preparedData',
          'table.autocompleteLists',
        ],
        ignoredActions: ['table/computedDataUpdated', 'table/setWebsitesData'],
      },
    }),
  devTools: {
    trace: true,
    traceLimit: 10,
  },
});
