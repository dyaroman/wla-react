import {
  REQUEST_ERROR,
  TOGGLE_IMG_PREVIEW_MODAL,
  TOGGLE_INFO_MODAL,
  TOGGLE_THEME,
  UNAUTHORIZED,
  URL_PARAMS_READ,
} from './app.constants';

const appInitialState = {
  infoModalOpen: false,
  imgPreviewUrl: null,
  theme: 'light',
  unauthorized: false,
  requestError: null,
  urlParamsRead: false,
};

export function appReducer(state = appInitialState, action) {
  switch (action.type) {
    case TOGGLE_INFO_MODAL:
      return {
        ...state,
        infoModalOpen: action.payload,
      };
    case TOGGLE_IMG_PREVIEW_MODAL:
      return {
        ...state,
        imgPreviewUrl: action.payload,
      };
    case TOGGLE_THEME:
      return {
        ...state,
        theme: action.payload === 'dark' ? 'dark' : 'light',
      };
    case UNAUTHORIZED:
      return {
        ...state,
        unauthorized: action.payload,
      };
    case REQUEST_ERROR:
      return {
        ...state,
        requestError: action.payload,
      };
    case URL_PARAMS_READ:
      return {
        ...state,
        urlParamsRead: action.payload,
      };
    default:
      return state;
  }
}
