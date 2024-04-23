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
import { SHOW_COLUMNS } from '../../misc/url.constants';
import { COLUMNS } from '../../misc/columns.constants';
import {
  filterTableData,
  getQueryParamValue,
  getUniqueTags,
  sortTableData,
} from '../../misc/functions';

export function getWebsitesData() {
  return async function (dispatch, getState) {
    const dataFileURL = `${process.env.REACT_APP_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`;
    try {
      const response = await fetch(dataFileURL);
      switch (response.status) {
        case 200:
          const websitesData = await response.json();
          const columns = {
            // add checkbox column
            [COLUMNS.checkbox]: {
              renderFilter: false,
              renderColumn: true,
              showColumn: false,
            },
            ...websitesData['columns'],
          };
          const websites = websitesData['websites'];

          // collect all filters
          const filters = {
            ...getState().table.filters,
          };
          Object.keys(columns)
            .filter((column) => columns[column]['renderFilter'])
            .filter((column) => !getState().table.filters[column])
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
            newState[SHOW_COLUMNS] = defaultShowColumns;
            getShowColumnsFromUrl();
          }

          function getShowColumnsFromUrl() {
            const showColumns = getQueryParamValue(SHOW_COLUMNS);
            // if URL doesn't contain parameter
            if (!showColumns) return;

            // if showColumns equal to alias 'all'
            // show all renderable columns
            if (showColumns === 'all') {
              newState[SHOW_COLUMNS] = renderableColumns;
              return;
            }

            // if shownColumns equal to alias 'none'
            // hide all columns
            if (showColumns === 'none') {
              newState[SHOW_COLUMNS] = [];
              return;
            }

            const filteredColumns = showColumns
              .split(',')
              .filter((column) => renderableColumns.includes(column));
            if (filteredColumns.length > 0) {
              newState[SHOW_COLUMNS] = filteredColumns;
            }
          }
          dispatch({
            type: SET_WEBSITES_DATA,
            payload: newState,
          });
          break;
        case 401:
          dispatch({
            type: UNAUTHORIZED,
            payload: true,
          });
          break;
        default:
          dispatch({
            type: REQUEST_ERROR,
            payload: response.status,
          });
          break;
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({
        type: WEBSITES_DATA_LOADED,
        payload: true,
      });
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
        if (![...renderableColumns, ...Object.keys(sort)].includes(key)) {
          continue;
        }
        switch (key) {
          case 'column':
            newSort[key] = value;
            sortedColumns.push(value);
            break;
          case 'direction':
            newSort[key] = value;
            break;

          case COLUMNS.tags:
            newFilters[key] = value.split(',');
            break;

          default:
            newFilters[key] = value;
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
