import {
  ASC,
  COMPUTED_DATA_UPDATED,
  DESC,
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SHOW_COLUMNS_UPDATED,
  SORT_UPDATED,
  TAGS_UPDATED,
  URL_PARAMS_COMBINED_UPDATE,
  URL_PARAMS_READ,
  WEBSITES_DATA_SOURCE,
} from './table.constants';
import { REQUEST_ERROR, UNAUTHORIZED } from '../app/app.constants';
import {
  PER_PAGE_VALUES,
  WEBSITES_DATA_FILENAME,
} from '../../misc/misc.constants';
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
    return fetch(`${__WEBSITES_DATA_URL__}/${WEBSITES_DATA_FILENAME}`, {
      method,
    });
  }

  function _fetchFromDB() {
    return fetch(`${__WLA_BACKEND_URL__}/combined?env=${hostEnv}`, { method });
  }

  const { hostEnv } = getEnvironmentConfig();
  if (hostEnv && getQueryParamValue('ds') !== 'file') {
    try {
      const responseFromDB = await _fetchFromDB();
      if (responseFromDB.ok) return responseFromDB;
      throw new Error(responseFromDB.statusText);
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
    const operationKey = '__wla_getWebsitesData__';
    if (localStorage.getItem(operationKey) === 'running') {
      return;
    }
    localStorage.setItem(operationKey, 'running');

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
          const payload = {
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
          payload['defaultShowColumns'] = defaultShowColumns;

          // get renderable columns
          const renderableColumns = Object.keys(columns).filter(
            (column) => columns[column]['renderColumn'],
          );
          payload['renderableColumns'] = renderableColumns;

          // get showColumns from URL
          payload[URL_PARAMETERS.showColumns] = defaultShowColumns;
          getShowColumnsFromUrl();

          function getShowColumnsFromUrl() {
            const showColumns = getQueryParamValue(
              URL_PARAMETERS.showColumns,
            )?.toLowerCase();
            // if URL doesn't contain parameter
            if (!showColumns) return;

            // if showColumns equal to alias 'all'
            // show all renderable columns
            if (showColumns === 'all') {
              payload[URL_PARAMETERS.showColumns] = renderableColumns;
              return;
            }

            // if shownColumns equal to alias 'none'
            // hide all columns
            if (showColumns === 'none') {
              payload[URL_PARAMETERS.showColumns] = [];
              return;
            }

            const filteredColumns = showColumns
              .split(',')
              .map((column) =>
                findArrayElementCaseInsensitive(column, renderableColumns),
              )
              .filter((column) => renderableColumns.includes(column));
            if (filteredColumns.length > 0) {
              payload[URL_PARAMETERS.showColumns] = filteredColumns;
            }
          }

          payload['websitesDataLoaded'] = true;

          dispatch({
            type: SET_WEBSITES_DATA,
            payload,
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
    } finally {
      localStorage.removeItem(operationKey);
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
    // we should read url params only after websites data loaded, because we get filters from data
    const params = new URLSearchParams(window.location.search);
    if (params.size === 0) {
      dispatch({
        type: URL_PARAMS_READ,
        payload: true,
      });
    }

    const payload = {};
    const newSort = {};
    const newFilters = {};
    const newTags = [];
    const filters = getState().table.filters;
    const showColumns = getState().table.showColumns;
    const renderableColumns = getState().table.renderableColumns;

    const keysToRead = [
      ...Object.keys(filters),
      COLUMNS.tags,
      ...Object.values(URL_PARAMETERS),
    ];

    for (const [key, value] of params) {
      const validatedKey = keysToRead.find(
        (el) => el.toLowerCase() === key.toLowerCase(),
      );

      // unknown key, go next
      if (!validatedKey) continue;

      // remove search parameter in wrong case if we find correct one
      if (key !== validatedKey) {
        deleteQueryParam(key);
      }

      switch (validatedKey) {
        // filters
        case Object.keys(filters).find((filter) => filter === validatedKey):
          newFilters[validatedKey] = value;
          break;

        // tags
        case COLUMNS.tags:
          newTags.push(...new Set(value.split(',')));
          break;

        // sort
        case URL_PARAMETERS.column: {
          const column = findArrayElementCaseInsensitive(
            value,
            renderableColumns,
          );

          if (!column) continue;

          newSort[validatedKey] = column;
          break;
        }
        case URL_PARAMETERS.direction: {
          const direction = findArrayElementCaseInsensitive(value, [ASC, DESC]);

          if (!direction) continue;

          newSort[validatedKey] = direction;
          break;
        }

        // pagination
        case URL_PARAMETERS.currentPage: {
          const perPage =
            params.get(URL_PARAMETERS.perPage) ?? getState().table.perPage;
          const newCurrentPage = Number(value);
          if (
            newCurrentPage > 0 &&
            newCurrentPage <=
              Math.ceil(getState().table.preparedData.length / perPage)
          ) {
            payload[URL_PARAMETERS.currentPage] = newCurrentPage;
          }
          break;
        }
        case URL_PARAMETERS.perPage:
          if (PER_PAGE_VALUES.includes(Number(value))) {
            payload[URL_PARAMETERS.perPage] = value;
          }
          break;

        // showColumns read from url in getWebsitesData() to prevent unnecessary rerender
        case URL_PARAMETERS.showColumns:
          break;

        default:
          break;
      }
    }

    const combinedShowColumns = new Set([
      ...showColumns,
      ...Object.keys(newFilters),
    ]);

    if (newTags.length > 0) {
      combinedShowColumns.add(COLUMNS.tags);
    }
    if (newSort[URL_PARAMETERS.column]) {
      combinedShowColumns.add(newSort[URL_PARAMETERS.column]);
    }

    payload['filters'] = newFilters;
    payload[URL_PARAMETERS.showColumns] = Array.from(combinedShowColumns);
    payload['sort'] = newSort;
    payload['tags'] = newTags;
    payload['urlParamsRead'] = true;

    dispatch({
      type: URL_PARAMS_COMBINED_UPDATE,
      payload,
    });
  };
}

export function updateURL() {
  return function (_, getState) {
    if (!getState().table.urlParamsRead) return;
    const filters = getState().table.filters;
    const tags = getState().table.tags;
    const currentPage = getState().table.currentPage;
    const perPage = getState().table.perPage;
    const sort = getState().table.sort;
    const showColumns = getState().table.showColumns;
    const keysToUpdate = [
      ...Object.keys(filters),
      COLUMNS.tags,
      ...Object.values(URL_PARAMETERS),
    ];
    const params = new URLSearchParams(window.location.search);
    // remove duplicated url keys in wrong case
    for (const [urlKey] of params) {
      for (const key of keysToUpdate) {
        if (urlKey.toLowerCase() === key.toLowerCase() && urlKey !== key) {
          console.log('delete urlKey', urlKey);
          params.delete(urlKey);
          break;
        }
      }
    }

    for (const key of keysToUpdate) {
      // filters
      if (Object.keys(filters).includes(key)) {
        if (filters[key]) {
          params.set(key, filters[key]);
        } else {
          params.delete(key);
        }

        continue;
      }

      // tags
      if (key === COLUMNS.tags) {
        if (tags.length === 0) {
          params.delete(key);
        } else {
          params.set(key, tags.join());
        }
        continue;
      }

      // misc
      if (Object.values(URL_PARAMETERS).includes(key)) {
        switch (key) {
          case URL_PARAMETERS.showColumns:
            if (showColumns.length === 0) {
              params.delete(key);
            } else {
              params.set(key, showColumns.join());
            }
            break;

          // pagination
          case URL_PARAMETERS.currentPage:
            if (Number(currentPage) !== 1) {
              params.set(key, currentPage);
            } else {
              params.delete(key);
            }
            break;

          case URL_PARAMETERS.perPage:
            if (Number(perPage) !== 25) {
              params.set(key, perPage);
            } else {
              params.delete(key);
            }
            break;

          // sort
          case URL_PARAMETERS.column:
          case URL_PARAMETERS.direction: {
            const value = sort[key];
            if (value) {
              params.set(key, value);
            } else {
              params.delete(key);
            }
            break;
          }
        }

        continue;
      }
    }

    // check if showColumns equal to defaultShowColumns
    // in this case we don't want to save it in URL
    const defaultShowColumns = getState()?.table?.defaultShowColumns;
    if (
      showColumns.length === defaultShowColumns.length &&
      showColumns.every((column) => defaultShowColumns.includes(column))
    ) {
      params.delete(URL_PARAMETERS.showColumns);
    }

    // check if showColumns equal to renderableColumns
    // in this case we should use alias 'all'
    const renderableColumns = getState()?.table?.renderableColumns;
    if (
      showColumns.length === renderableColumns.length &&
      showColumns.every((column) => renderableColumns.includes(column))
    ) {
      params.set(URL_PARAMETERS.showColumns, 'all');
    }

    // check if showColumns is an empty array
    // in this case we should use alias 'none'
    if (
      params.get(URL_PARAMETERS.showColumns) === null &&
      showColumns.length === 0
    ) {
      params.set(URL_PARAMETERS.showColumns, 'none');
    }

    const search = params.toString();
    const newUrl = search
      ? `${window.location.pathname}?${search}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
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

    let sortedData = sortTableData(
      preparedData,
      sort.column || COLUMNS.website,
    );
    if (sort.direction === DESC) {
      sortedData = sortedData.reverse();
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
  return function (dispatch) {
    dispatch({
      type: SHOW_COLUMNS_UPDATED,
      payload: showColumns,
    });
  };
}
