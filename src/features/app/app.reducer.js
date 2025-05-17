import {
  REQUEST_ERROR,
  TOGGLE_IMG_PREVIEW_MODAL,
  TOGGLE_INFO_MODAL_OPENED,
  UNAUTHORIZED,
} from './app.constants';

const appInitialState = {
  imgPreviewUrl: null,
  infoModalOpened: false,
  requestError: null,
  unauthorized: false,
};

export function appReducer(state = appInitialState, action) {
  switch (action.type) {
    case REQUEST_ERROR:
      return {
        ...state,
        requestError: action.payload,
      };

    case TOGGLE_IMG_PREVIEW_MODAL:
      return {
        ...state,
        imgPreviewUrl: action.payload,
      };

    case TOGGLE_INFO_MODAL_OPENED:
      return {
        ...state,
        infoModalOpened: action.payload,
      };

    case UNAUTHORIZED:
      return {
        ...state,
        unauthorized: action.payload,
      };

    default:
      return state;
  }
}
