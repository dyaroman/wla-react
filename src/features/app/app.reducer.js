import {
  REQUEST_ERROR,
  TOGGLE_CUSTOMIZATION_COLUMNS_EXPANDED,
  TOGGLE_FILTERS_EXPANDED,
  TOGGLE_IMG_PREVIEW_MODAL,
  TOGGLE_INFO_MODAL_OPENED,
  TOGGLE_SIDEBAR_OPENED,
  TOGGLE_THEME,
  UNAUTHORIZED,
  URL_PARAMS_READ,
} from './app.constants';

const appInitialState = {
  sidebarOpened: false,
  filtersExpanded: true,
  customizeColumnsExpanded: true,
  infoModalOpened: false,
  imgPreviewUrl: null,
  theme: 'light',
  unauthorized: false,
  requestError: null,
  urlParamsRead: false,
};

export function appReducer(state = appInitialState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR_OPENED:
      return {
        ...state,
        sidebarOpened: action.payload,
      };

    case TOGGLE_FILTERS_EXPANDED:
      return {
        ...state,
        filtersExpanded: action.payload,
      };

    case TOGGLE_CUSTOMIZATION_COLUMNS_EXPANDED:
      return {
        ...state,
        customizeColumnsExpanded: action.payload,
      };

    case TOGGLE_INFO_MODAL_OPENED:
      return {
        ...state,
        infoModalOpened: action.payload,
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
