import { createSlice } from '@reduxjs/toolkit';

const drawerSlice = createSlice({
  name: 'drawer',
  initialState: {
    openDrawerId: null,
  },
  reducers: {
    openDrawer(state, action) {
      state.openDrawerId = action.payload;
    },
    closeDrawer(state) {
      state.openDrawerId = null;
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;

export const drawerReducer = drawerSlice.reducer;
