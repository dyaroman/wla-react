import {
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SORT_UPDATED,
  WEBSITES_DATA_LOADED,
} from './table.constants';
import { filterTableData, sortTableData } from '../../misc/functions';
import {
  REQUEST_ERROR,
  UNAUTHORIZED,
  URL_PARAMS_READ,
} from '../app/app.constants';
import { WEBSITES_DATA_FILENAME } from '../../misc/constants';

export function getWebsitesData() {
  return async function (dispatch) {
    const dataFileURL = `${process.env.REACT_APP_WEBSITES_DATA_URL}/${WEBSITES_DATA_FILENAME}`;
    try {
      const response = await fetch(dataFileURL);
      switch (response.status) {
        case 200:
          let websitesData = await response.json();
          const useWlaBackend = getQueryParamValue('mode') === 'backend';
          if (useWlaBackend) {
            const { env, project } = websitesData;
            try {
              const { commit, timestamp } = await fetch(
                `https://backend.example.com/getInfo?key=YOUR_API_KEY&project=${project}&env=${env}`
              ).then((res) => res.json());
              if (commit) websitesData.commit = commit;
              if (timestamp) websitesData.timestamp = timestamp;
            } catch (e) {
              console.log('Error due to get info from backend', e);
            }

            try {
              const websitesDataFromBackend = await fetch(
                `https://backend.example.com/getWebsitesData?key=YOUR_API_KEY&project=${project}&env=${env}`
              ).then((res) => res.json());
              if (websitesDataFromBackend && websitesDataFromBackend.length)
                websitesData.websites = websitesDataFromBackend;
            } catch (e) {
              console.log('Error due to get websites data from backend', e);
            }
          }
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
    const newSort = {};
    const newFilters = {};
    const { filters, sort } = getState().table;
    const params = new URLSearchParams(window.location.search);
    if (!params['size']) return;
    for (const [key, value] of params) {
      if (![...Object.keys(filters), ...Object.keys(sort)].includes(key)) {
        continue;
      }
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
      type: URL_PARAMS_READ,
      payload: true,
    });
  };
}

export function updateTableData() {
  return function (dispatch, getState) {
    const { websitesData, filters, sort } = getState().table;
    let updatedData = [...websitesData['websites']];

    for (const filterKey in filters) {
      if (['', '=', '==', '!', '!='].includes(filters[filterKey])) {
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

export function getQueryParamValue(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}
