import {
  COMPUTED_DATA_UPDATED,
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SHOW_COLUMNS_UPDATED,
  SORT_UPDATED,
  TAGS_UPDATED,
  URL_PARAMS_COMBINED_UPDATE,
  WEBSITES_DATA_LOADED,
  WEBSITES_DATA_SOURCE,
} from './table.constants';
import {
  REQUEST_ERROR,
  UNAUTHORIZED,
  URL_PARAMS_READ,
} from '../app/app.constants';
import { WEBSITES_DATA_FILENAME } from '../../misc/misc.constants';
import { URL_PARAMETERS } from '../../misc/url.constants';
import { COLUMNS } from '../../misc/columns.constants';
import { gtmEvents } from '../../misc/gtm.constants';
import {
  deleteQueryParam,
  filterTableData,
  findArrayElementCaseInsensitive,
  getQueryParamValue,
  getUniqueTags,
  getUniqueValues,
  sortTableData,
  triggerGtmEvent,
} from '../../misc/functions';
import { showToast } from '../toast/toast.actions';

function getEnvironmentConfig() {
  let hostEnv = null;
  const subdomain = window.location.hostname.split('.')[0];
  if (['localhost', 'rc', 'dev', 'prod'].includes(subdomain)) {
    hostEnv = subdomain === 'prod' ? 'prod' : 'dev';
  }
  return { hostEnv };
}

async function fetchWebsitesData({ method = 'GET' } = {}) {
  function _fetchFromFile() {
    return fetch(
      `${import.meta.env.VITE_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`,
      { method },
    );
  }

  function _fetchFromDB() {
    return fetch(
      `${import.meta.env.VITE_WLA_BACKEND_URL}/combined?env=${hostEnv}`,
      { method },
    );
  }

  const { hostEnv } = getEnvironmentConfig();
  if (hostEnv && getQueryParamValue('ds') !== 'file') {
    try {
      return await _fetchFromDB();
    } catch (error) {
      console.log(
        `Falling back to "${WEBSITES_DATA_FILENAME}", failed to load from DB:`,
        error.message,
      );
      return await _fetchFromFile();
    }
  } else {
    return await _fetchFromFile();
  }
}

export function getWebsitesData() {
  return async function (dispatch, getState) {
    const { hostEnv } = getEnvironmentConfig();
    try {
      const response = await fetchWebsitesData();
      switch (response.status) {
        case 200: {
          const ETag = response.headers.get('ETag');
          const websitesData = await response.json();

          const dataSource = response.url.includes(WEBSITES_DATA_FILENAME)
            ? 'file'
            : 'db';
          dispatch({
            type: WEBSITES_DATA_SOURCE,
            payload: dataSource,
          });
          const columns = websitesData['columns'];
          const websites = websitesData['websites'];

          if (!websitesData['env']) {
            websitesData['env'] = hostEnv;
          }

          // collect all filters
          const filters = {};
          for (const column in columns) {
            if (!columns[column]['renderFilter']) continue;
            if (column === COLUMNS.tags) continue;

            filters[column] = '';
          }

          // collect all unique tags
          const allTags = getUniqueTags(websites).sort();
          const newState = {
            ...getState().table,
            filters,
            allTags,
            availableTags: allTags,
            websitesData,
            websitesDataETag: ETag,
          };

          // get default show columns
          const defaultShowColumns = Object.keys(columns).filter(
            (column) => columns[column]['showColumn'],
          );
          newState['defaultShowColumns'] = defaultShowColumns;

          // get renderable columns
          const renderableColumns = Object.keys(columns).filter(
            (column) => columns[column]['renderColumn'],
          );
          newState['renderableColumns'] = renderableColumns;

          // get showColumns from URL
          if (!getState().table.websitesDataLoaded) {
            newState[URL_PARAMETERS.showColumns] = defaultShowColumns;
            getShowColumnsFromUrl();
          }

          function getShowColumnsFromUrl() {
            let showColumns = getQueryParamValue(URL_PARAMETERS.showColumns);
            // if URL doesn't contain parameter
            if (!showColumns) return;

            showColumns = showColumns.toLowerCase();

            // if showColumns equal to alias 'all'
            // show all renderable columns
            if (showColumns === 'all') {
              newState[URL_PARAMETERS.showColumns] = renderableColumns;
              return;
            }

            // if shownColumns equal to alias 'none'
            // hide all columns
            if (showColumns === 'none') {
              newState[URL_PARAMETERS.showColumns] = [];
              return;
            }

            const filteredColumns = showColumns
              .split(',')
              .map((column) =>
                findArrayElementCaseInsensitive(column, renderableColumns),
              )
              .filter((column) => renderableColumns.includes(column));
            if (filteredColumns.length > 0) {
              newState[URL_PARAMETERS.showColumns] = filteredColumns;
            }
          }

          dispatch({
            type: SET_WEBSITES_DATA,
            payload: newState,
          });
          dispatch({
            type: WEBSITES_DATA_LOADED,
            payload: true,
          });
          break;
        }

        case 401: {
          dispatch({
            type: UNAUTHORIZED,
            payload: true,
          });
          break;
        }

        default: {
          dispatch({
            type: REQUEST_ERROR,
            payload: `Status code: ${response.status}`,
          });
          break;
        }
      }
    } catch (error) {
      console.error(error);

      dispatch({
        type: REQUEST_ERROR,
        payload: error.message,
      });
    }
  };
}

export function checkForUpdates() {
  return async function (dispatch, getState) {
    const currentETag = getState().table.websitesDataETag;
    try {
      const response = await fetchWebsitesData({ method: 'HEAD' });
      const newETag = response.headers.get('ETag');
      if (currentETag && newETag && currentETag !== newETag) {
        dispatch(
          showToast(
            'New data is available. The page will be reloaded in 5 seconds.',
          ),
        );
        triggerGtmEvent(gtmEvents.freshDataAvailable);
        setTimeout(() => {
          window.location.reload();
        }, 5_000);
      }
    } catch (e) {
      console.error(e);
    }
  };
}

export function getURLParams() {
  return function (dispatch, getState) {
    // read url params only after websites data loaded, because we get filters from data
    if (!getState().table.websitesDataLoaded) return;
    const newSort = {};
    const newFilters = {};
    let newTags;
    const sort = getState().table.sort;
    const showColumns = getState().table.showColumns;
    const renderableColumns = getState().table.renderableColumns;
    const params = new URLSearchParams(window.location.search);
    if (params['size']) {
      const sortedColumns = [];
      for (let [key, value] of params) {
        const validatedKey = [...renderableColumns, ...Object.keys(sort)].find(
          (el) => el.toLowerCase() === key.toLowerCase(),
        );
        if (!validatedKey) continue;
        // remove search parameter in wrong case if we find correct one
        if (key !== validatedKey) {
          deleteQueryParam(key);
        }
        switch (validatedKey) {
          // sort keys
          case 'column':
            value = findArrayElementCaseInsensitive(value, renderableColumns);
            newSort[validatedKey] = value;
            sortedColumns.push(value);
            break;
          case 'direction':
            value = findArrayElementCaseInsensitive(value, ['asc', 'desc']);
            newSort[validatedKey] = value;
            break;

          // tags
          case COLUMNS.tags:
            newTags = value.split(',');
            break;

          default:
            newFilters[validatedKey] = value;
            break;
        }
      }
      // Combined dispatch for all URL parameters
      const combinedShowColumns = Array.from(
        new Set([...showColumns, ...sortedColumns, ...Object.keys(newFilters)]),
      )
        .filter((column) => renderableColumns.includes(column))
        // todo: move sort to reducer
        .sort(
          (a, b) =>
            Object.keys(getState().table.websitesData.columns).indexOf(a) -
            Object.keys(getState().table.websitesData.columns).indexOf(b),
        );

      dispatch({
        type: URL_PARAMS_COMBINED_UPDATE,
        payload: {
          sort: newSort,
          filters: newFilters,
          tags: newTags,
          showColumns: combinedShowColumns,
        },
      });
    }
    dispatch({
      type: URL_PARAMS_READ,
      payload: true,
    });
  };
}

export function filterTable() {
  return function (dispatch, getState) {
    const autocompleteLists = {};
    const websitesData = getState().table.websitesData;
    const filters = getState().table.filters;
    const tags = getState().table.tags;
    const filteredData = filterTableData(
      [...websitesData['websites']],
      filters,
      tags,
    );

    Object.keys(filters).map(
      (filter) =>
        (autocompleteLists[filter] = getUniqueValues(
          filteredData,
          filter,
        ).sort()),
    );

    dispatch({
      type: COMPUTED_DATA_UPDATED,
      payload: {
        preparedData: filteredData,
        availableTags: getUniqueTags(filteredData),
        autocompleteLists,
      },
    });
  };
}

export function sortTable() {
  return function (dispatch, getState) {
    const preparedData = getState().table.preparedData;
    const sort = getState().table.sort;

    let sortedData = preparedData;
    if (sort.direction) {
      sortedData = sortTableData(sortedData, sort.column);
      if (sort.direction === 'desc') {
        sortedData = sortedData.reverse();
      }
    }

    dispatch({
      type: PREPARED_DATA_UPDATED,
      payload: {
        preparedData: sortedData,
      },
    });
  };
}

export function resetFilters() {
  return function (dispatch, getState) {
    const filters = {};
    for (const filter in getState().table.filters) {
      filters[filter] = '';
    }
    dispatch({
      type: FILTERS_UPDATED,
      payload: filters,
    });
  };
}

export function resetTags() {
  return function (dispatch) {
    dispatch({
      type: TAGS_UPDATED,
      payload: [],
    });
  };
}

// todo: resetSort function here
export function resetSort() {
  return function (dispatch) {
    dispatch({
      type: SORT_UPDATED,
      payload: {
        column: '',
        direction: '',
      },
    });
  };
}

export function updateShowColumns(showColumns) {
  return function (dispatch, getState) {
    const columns = getState().table.websitesData.columns;
    const renderableColumns = getState().table.renderableColumns;

    dispatch({
      type: SHOW_COLUMNS_UPDATED,
      payload: showColumns
        .filter((column) => renderableColumns.includes(column))
        .sort(
          (a, b) =>
            Object.keys(columns).indexOf(a) - Object.keys(columns).indexOf(b),
        ),
    });
  };
}
