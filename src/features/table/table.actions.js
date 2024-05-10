import {
  CLEAR_FILTERS,
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SHOW_COLUMNS_UPDATED,
  SORT_UPDATED,
  WEBSITES_DATA_LOADED,
} from './table.constants';
import {
  REQUEST_ERROR,
  UNAUTHORIZED,
  URL_PARAMS_READ,
} from '../app/app.constants';
import { WEBSITES_DATA_FILENAME } from '../../misc/misc.constants';
import { URL_PARAMETERS } from '../../misc/url.constants';
import { COLUMNS } from '../../misc/columns.constants';
import {
  deleteQueryParam,
  filterTableData,
  findArrayElementCaseInsensitive,
  getQueryParamValue,
  getUniqueTags,
  sortTableData,
} from '../../misc/functions';
import { toggleSidebarOpen } from '../app/app.actions';

export function getWebsitesData() {
  return async function (dispatch, getState) {
    const dataFileURL = `${process.env.REACT_APP_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`;
    try {
      const response = await fetch(dataFileURL);
      switch (response.status) {
        case 200: {
          const websitesData = await response.json();
          const columns = websitesData['columns'];
          const websites = websitesData['websites'];

          // collect all filters
          const filters = {
            ...getState().table.filters,
          };
          Object.keys(columns)
            .filter(
              (column) =>
                columns[column]['renderFilter'] &&
                !getState().table.filters[column],
            )
            .forEach((column) => {
              if (column === COLUMNS.tags) filters[column] = [];
              else filters[column] = '';
            });

          // collect all unique tags
          const allTags = getUniqueTags(websites);
          const newState = {
            ...getState().table,
            filters,
            allTags,
            availableTags: allTags,
            websitesData,
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
            payload: response.status,
          });
          break;
        }
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
    const sort = getState().table.sort;
    const showColumns = getState().table.showColumns;
    const renderableColumns = getState().table.renderableColumns;
    const params = new URLSearchParams(window.location.search);
    if (params['size']) {
      const sortedColumns = [];
      for (const [key, value] of params) {
        const validatedKey = [
          ...renderableColumns,
          ...Object.keys(sort),
          URL_PARAMETERS.sidebarOpen,
        ].find((el) => el.toLowerCase() === key.toLowerCase());
        if (!validatedKey) continue;
        // remove search parameter in wrong case if we find correct one
        if (key !== validatedKey) {
          deleteQueryParam(key);
        }
        switch (validatedKey) {
          // sort keys
          case 'column':
            newSort[validatedKey] = value;
            sortedColumns.push(value);
            break;
          case 'direction':
            newSort[validatedKey] = value;
            break;

          case COLUMNS.tags:
            newFilters[validatedKey] = value.split(',');
            break;

          case URL_PARAMETERS.sidebarOpen:
            dispatch(toggleSidebarOpen(value === ''));
            break;

          default:
            newFilters[validatedKey] = value;
            break;
        }
      }
      dispatch({
        type: SORT_UPDATED,
        payload: newSort,
      });
      dispatch({
        type: FILTERS_UPDATED,
        payload: newFilters,
      });
      dispatch(
        updateShowColumns([
          ...new Set([
            ...showColumns,
            ...sortedColumns,
            ...Object.keys(newFilters),
          ]),
        ]),
      );
    }
    dispatch({
      type: URL_PARAMS_READ,
      payload: true,
    });
  };
}

export function updateTableData() {
  return function (dispatch, getState) {
    const websitesData = getState().table.websitesData;
    const filters = getState().table.filters;
    const sort = getState().table.sort;
    const filteredData = filterTableData(
      [...websitesData['websites']],
      filters,
    );
    let updatedData = filteredData;
    if (sort.direction) {
      const sortedData = sortTableData(filteredData, sort.column);
      if (sort.direction === 'asc') {
        updatedData = sortedData;
      } else if (sort.direction === 'desc') {
        updatedData = sortedData.reverse();
      }
    }

    dispatch({
      type: PREPARED_DATA_UPDATED,
      payload: {
        preparedData: updatedData,
        availableTags: getUniqueTags(updatedData),
      },
    });
  };
}

export function clearFilters() {
  return function (dispatch, getState) {
    const filters = {};
    for (const filter in getState().table.filters) {
      if (filter === COLUMNS.tags) filters[filter] = [];
      else filters[filter] = '';
    }
    const sort = {
      column: '',
      direction: '',
    };
    dispatch({
      type: CLEAR_FILTERS,
      payload: {
        filters,
        sort,
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
