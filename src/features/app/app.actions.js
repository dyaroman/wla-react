import {
  CUSTOMIZE_COLUMNS_OPEN,
  FILTERS_OPEN,
  SHOW_COLUMNS,
  TAGS,
} from '../../misc/url.constants';
import {
  TOGGLE_CUSTOMIZE_COLUMNS_OPEN,
  TOGGLE_FILTERS_OPEN,
} from './app.constants';
import {
  deleteQueryParamValue,
  setQueryParamValue,
} from '../../misc/functions';

export function updateURL(newState) {
  return function (dispatch, getState) {
    if (!getState().app.urlParamsRead) return;
    if (Object.keys(newState).length === 0) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    for (const key in newState) {
      switch (key) {
        case SHOW_COLUMNS:
        case TAGS:
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
      newState[SHOW_COLUMNS].length === defaultShowColumns.length &&
      newState[SHOW_COLUMNS].every((column) =>
        defaultShowColumns.includes(column),
      )
    ) {
      params.delete(SHOW_COLUMNS);
    }

    // check if showColumns equal to renderableColumns
    // in this case we should use alias 'all'
    const renderableColumns = getState()?.table?.renderableColumns;
    if (
      newState[SHOW_COLUMNS].length === renderableColumns.length &&
      newState[SHOW_COLUMNS].every((column) =>
        renderableColumns.includes(column),
      )
    ) {
      params.set(SHOW_COLUMNS, 'all');
    }

    // check if showColumns is an empty array
    // in this case we should use alias 'none'
    if (
      params.get(SHOW_COLUMNS) === null &&
      newState[SHOW_COLUMNS].length === 0
    ) {
      params.set(SHOW_COLUMNS, 'none');
    }

    if (params.toString() === '') {
      window.history.replaceState({}, '', '/');
    } else {
      window.history.replaceState({}, '', `?${params}`);
    }
  };
}

export function toggleFiltersOpen(open) {
  if (open) {
    setQueryParamValue(FILTERS_OPEN, '');
  } else {
    deleteQueryParamValue(FILTERS_OPEN);
  }
  return function (dispatch) {
    dispatch({
      type: TOGGLE_FILTERS_OPEN,
      payload: open,
    });
  };
}

export function toggleCustomizeColumnsOpen(open) {
  if (open) {
    setQueryParamValue(CUSTOMIZE_COLUMNS_OPEN, '');
  } else {
    deleteQueryParamValue(CUSTOMIZE_COLUMNS_OPEN);
  }
  return function (dispatch) {
    dispatch({
      type: TOGGLE_CUSTOMIZE_COLUMNS_OPEN,
      payload: open,
    });
  };
}
