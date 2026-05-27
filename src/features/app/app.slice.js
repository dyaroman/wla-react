import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    imgPreviewUrl: null,
    infoModalOpened: false,
    requestError: null,
    unauthorized: false,
  },
  reducers: {
    requestError(state, action) {
      state.requestError = action.payload;
    },
    toggleImgPreviewModal(state, action) {
      state.imgPreviewUrl = action.payload;
    },
    toggleInfoModalOpened(state, action) {
      state.infoModalOpened = action.payload;
    },
    unauthorized(state, action) {
      state.unauthorized = action.payload;
    },
  },
});

export const {
  requestError,
  toggleImgPreviewModal,
  toggleInfoModalOpened,
  unauthorized,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
