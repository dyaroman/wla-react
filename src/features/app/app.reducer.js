import {
  REQUEST_ERROR,
  TOGGLE_CUSTOMIZATION_COLUMNS_EXPANDED,
  TOGGLE_CUSTOMIZATION_COLUMNS_OPENED,
  TOGGLE_FILTERS_EXPANDED,
  TOGGLE_FILTERS_OPENED,
  TOGGLE_IMG_PREVIEW_MODAL,
  TOGGLE_INFO_MODAL_OPENED,
  TOGGLE_SIDEBAR_OPENED,
  TOGGLE_TAGS_OPENED,
  UNAUTHORIZED,
  URL_PARAMS_READ,
} from './app.constants';

const appInitialState = {
  customizationColumnsOpened: false,
  customizeColumnsExpanded: true,
  filtersExpanded: true,
  filtersOpened: false,
  imgPreviewUrl: null,
  infoModalOpened: false,
  requestError: null,
  sidebarOpened: false,
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

    case TOGGLE_CUSTOMIZATION_COLUMNS_EXPANDED:
      return {
        ...state,
        customizeColumnsExpanded: action.payload,
      };

    case TOGGLE_FILTERS_EXPANDED:
      return {
        ...state,
        filtersExpanded: action.payload,
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

    case TOGGLE_SIDEBAR_OPENED:
      return {
        ...state,
        sidebarOpened: action.payload,
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
