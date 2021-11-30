import {
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SORT_UPDATED,
  WEBSITES_DATA_LOADED,
  WEBSITES_DATA_UNAUTHORIZED_ERROR,
} from './table.constants';
import { filterTableData, sortTableData } from '../../misc/functions';

export function getWebsitesData() {
  return async function (dispatch) {
    const dataFileURL = `${process.env.REACT_APP_WEBSITES_DATA_URL}/websites-data.json`;
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
        case 'sortColumn':
        case 'sortDirection':
          newSort[key] = value;
          break;

        case 'website':
        case 'template':
        case 'campaignId':
        case 'mainForm':
        case 'altForm':
        case 'owner':
        case 'gtmKey':
        case 'companyName':
        case 'email':
          newFilters[key] = value;
          break;
        case 'tags':
          newFilters[key] = value.split(',');
          break;

        default:
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
      if (filters[filterKey] !== '') {
        updatedData = filterTableData(
          filterKey,
          filters[filterKey],
          updatedData
        );
      }
    }

    if (sort.sortDirection === 'asc') {
      updatedData = sortTableData(updatedData, sort.sortColumn);
    } else if (sort.sortDirection === 'desc') {
      updatedData = sortTableData(updatedData, sort.sortColumn).reverse();
    }

    dispatch({
      type: PREPARED_DATA_UPDATED,
      payload: updatedData,
    });
  };
}
