import {
  REQUEST_ERROR,
  TOGGLE_CUSTOMIZATION_COLUMNS_OPENED,
  TOGGLE_FILTERS_OPENED,
  TOGGLE_IMG_PREVIEW_MODAL,
  TOGGLE_INFO_MODAL_OPENED,
  TOGGLE_HEADER_DRAWER_OPENED,
  TOGGLE_TAGS_OPENED,
  UNAUTHORIZED,
  URL_PARAMS_READ,
} from './app.constants';

const appInitialState = {
  customizationColumnsOpened: false,
  filtersOpened: false,
  imgPreviewUrl: null,
  infoModalOpened: false,
  requestError: null,
  headerDrawerOpened: false,
  tagsOpened: false,
  unauthorized: false,
  urlParamsRead: false,
};

export function appReducer(state = appInitialState, action) {
  switch (action.type) {
    case TOGGLE_CUSTOMIZATION_COLUMNS_OPENED:
      return {
        ...state,
        customizationColumnsOpened: action.payload,
      };

    case TOGGLE_FILTERS_OPENED:
      return {
        ...state,
        filtersOpened: action.payload,
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

    case REQUEST_ERROR:
      return {
        ...state,
        requestError: action.payload,
      };

    case TOGGLE_HEADER_DRAWER_OPENED:
      return {
        ...state,
        headerDrawerOpened: action.payload,
      };

    case TOGGLE_TAGS_OPENED:
      return {
        ...state,
        tagsOpened: action.payload,
      };

    case UNAUTHORIZED:
      return {
        ...state,
        unauthorized: action.payload,
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
