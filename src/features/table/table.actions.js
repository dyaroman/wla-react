import {
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SORT_UPDATED,
  WEBSITES_DATA_LOADED,
  WEBSITES_DATA_UNAUTHORIZED_ERROR,
} from './table.constants';
import { filterTableData, sortTableData } from '../../misc/functions';
import { WEBSITES_DATA_FILENAME } from '../../misc/constants';

export function getWebsitesData() {
  return async function (dispatch) {
    const dataFileURL = `${process.env.REACT_APP_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`;
    try {
      const response = await fetch(dataFileURL);
      if (response.status === 401) {
        dispatch({
          type: WEBSITES_DATA_UNAUTHORIZED_ERROR,
          payload: true,
        });
      } else {
        const data = await response.json();
        dispatch({
          type: SET_WEBSITES_DATA,
          payload: data,
        });
      }
      dispatch({
        type: WEBSITES_DATA_LOADED,
        payload: true,
      });
    } catch (e) {
      console.error(e);
    }
  };
}

export function getURLParams() {
  return function (dispatch) {
    const newSort = {};
    const newFilters = {};
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      switch (key) {
        case 'column':
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
    });
    dispatch({
      type: SORT_UPDATED,
      payload: newSort,
    });
    dispatch({
      type: FILTERS_UPDATED,
      payload: newFilters,
    });
  };
}

export function updateTableData() {
  return function (dispatch, getState) {
    const { websitesData, filters, sort } = getState().table;
    let updatedData = [...websitesData['websites']];

    for (const filterKey in filters) {
      if (filters[filterKey] === '' || filters[filterKey] === '=') {
        continue;
      }
      updatedData = filterTableData(filterKey, filters[filterKey], updatedData);
    }

    if (sort.direction === 'asc') {
      updatedData = sortTableData(updatedData, sort.column);
    } else if (sort.direction === 'desc') {
      updatedData = sortTableData(updatedData, sort.column).reverse();
    }

    dispatch({
      type: PREPARED_DATA_UPDATED,
      payload: updatedData,
    });
  };
}
