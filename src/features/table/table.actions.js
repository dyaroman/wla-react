import {
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SHOWED_COLUMNS_UPDATED,
  SORT_UPDATED,
  WEBSITES_DATA_LOADED,
} from './table.constants';
import {
  REQUEST_ERROR,
  UNAUTHORIZED,
  URL_PARAMS_READ,
} from '../app/app.constants';
import {
  filterTableData,
  getQueryParamValue,
  sortTableData,
} from '../../misc/functions';
import { WEBSITES_DATA_FILENAME } from '../../misc/constants';

export function getWebsitesData() {
  return async function (dispatch) {
    const dataFileURL = `${process.env.REACT_APP_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`;
    try {
      const response = await fetch(dataFileURL);
      switch (response.status) {
        case 200:
          const websitesData = await response.json();
          dispatch({
            type: SET_WEBSITES_DATA,
            payload: websitesData,
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
    const { sort, websitesData, showedColumns } = getState().table;
    const params = new URLSearchParams(window.location.search);
    if (params['size']) {
      const sortedColumns = [];
      for (const [key, value] of params) {
        if (
          ![
            ...Object.keys(websitesData.columns),
            ...Object.keys(sort),
          ].includes(key)
        ) {
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

          case 'tags':
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
      dispatch({
        type: SHOWED_COLUMNS_UPDATED,
        payload: [
          ...new Set([
            ...showedColumns,
            ...sortedColumns,
            ...Object.keys(newFilters),
          ]),
        ],
      });
    }
    dispatch({
      type: URL_PARAMS_READ,
      payload: true,
    });
  };
}

export function updateTableData() {
  return function (dispatch, getState) {
    const { websitesData, filters, sort } = getState().table;
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
      payload: updatedData,
    });
  };
}
