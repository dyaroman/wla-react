import { URL_PARAMETERS } from '../../misc/url.constants';
import { COLUMNS } from '../../misc/columns.constants';
import {
  TOGGLE_CUSTOMIZATION_COLUMNS_EXPANDED,
  TOGGLE_FILTERS_EXPANDED,
  TOGGLE_SIDEBAR_OPENED,
} from './app.constants';
import { deleteQueryParam, setQueryParam } from '../../misc/functions';

export function updateURL(newState) {
  return function (dispatch, getState) {
    if (!getState().app.urlParamsRead) return;
    if (Object.keys(newState).length === 0) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    for (const key in newState) {
      // remove duplicated url keys in wrong case
      for (const [urlKey] of params) {
        if (urlKey.toLowerCase() === key.toLowerCase() && urlKey !== key) {
          params.delete(urlKey);
          break;
        }
      }
      switch (key) {
        case URL_PARAMETERS.showColumns:
        case COLUMNS.tags:
          if (newState[key].length === 0) {
            params.delete(key);
          } else {
            params.set(key, newState[key].join());
          }
          break;

        default:
          if (newState[key] === '') {
            params.delete(key);
          } else {
            params.set(key, newState[key]);
          }
          break;
      }
    }

    // check if showColumns equal to defaultShowColumns
    // in this case we don't want to save it in URL
    const defaultShowColumns = getState()?.table?.defaultShowColumns;
    if (
      newState[URL_PARAMETERS.showColumns].length ===
        defaultShowColumns.length &&
      newState[URL_PARAMETERS.showColumns].every((column) =>
        defaultShowColumns.includes(column),
      )
    ) {
      params.delete(URL_PARAMETERS.showColumns);
    }

    // check if showColumns equal to renderableColumns
    // in this case we should use alias 'all'
    const renderableColumns = getState()?.table?.renderableColumns;
    if (
      newState[URL_PARAMETERS.showColumns].length ===
        renderableColumns.length &&
      newState[URL_PARAMETERS.showColumns].every((column) =>
        renderableColumns.includes(column),
      )
    ) {
      params.set(URL_PARAMETERS.showColumns, 'all');
    }

    // check if showColumns is an empty array
    // in this case we should use alias 'none'
    if (
      params.get(URL_PARAMETERS.showColumns) === null &&
      newState[URL_PARAMETERS.showColumns].length === 0
    ) {
      params.set(URL_PARAMETERS.showColumns, 'none');
    }

    if (params.toString() === '') {
      window.history.replaceState({}, '', '/');
    } else {
      window.history.replaceState({}, '', `?${params}`);
    }
  };
}

export function toggleFiltersExpanded(open) {
  return function (dispatch) {
    dispatch({
      type: TOGGLE_FILTERS_EXPANDED,
      payload: open,
    });
  };
}

export function toggleSidebarOpened(open) {
  if (open) {
    setQueryParam(URL_PARAMETERS.sidebarOpened, '');
  } else {
    deleteQueryParam(URL_PARAMETERS.sidebarOpened);
  }
  return function (dispatch) {
    dispatch({
      type: TOGGLE_SIDEBAR_OPENED,
      payload: open,
    });
  };
}

export function toggleCustomizationColumnsExpanded(open) {
  return function (dispatch) {
    dispatch({
      type: TOGGLE_CUSTOMIZATION_COLUMNS_EXPANDED,
      payload: open,
    });
  };
}
