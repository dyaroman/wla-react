import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    active: [],
    queue: [],
  },
  reducers: {
    showToast: {
      prepare(message, type = 'default') {
        return {
          payload: {
            message,
            type,
            id: `${Date.now()}-${Math.random()}`,
          },
        };
      },
      reducer(state, action) {
        if (state.active.length < 3) {
          state.active.push(action.payload);
        } else {
          state.queue.push(action.payload);
        }
      },
    },
    hideToast(state) {
      state.active.shift();
      if (state.active.length < 3 && state.queue.length > 0) {
        state.active.push(state.queue.shift());
      }
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export const toastReducer = toastSlice.reducer;
