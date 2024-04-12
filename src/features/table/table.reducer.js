import {
  CLEAR_FILTERS,
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SHOWED_COLUMNS_UPDATED,
  SORT_UPDATED,
  WEBSITES_DATA_LOADED,
} from './table.constants';
import { getQueryParamValue, getUniqueTags } from '../../misc/functions';

const tableInitialState = {
  filters: {},
  sort: {
    column: '',
    direction: '',
  },
  websitesData: null,
  websitesDataLoaded: false,
  preparedData: [],
  showColumns: [],
  defaultShowColumns: [],
  allTags: [],
  availableTags: [],
};

export function tableReducer(state = tableInitialState, action) {
  switch (action.type) {
    case SET_WEBSITES_DATA: {
      const { columns, websites } = action.payload;

      // collect all filters
      const filters = {
        ...state.filters,
      };
      Object.keys(columns)
        .filter((column) => columns[column]['renderFilter'])
        .filter((column) => !state.filters[column])
        .forEach((column) => {
          if (column === 'tags') filters[column] = [];
          else filters[column] = '';
        });

      // collect all unique tags
      const allTags = getUniqueTags(websites);
      const updatedState = {
        ...state,
        filters,
        allTags,
        availableTags: allTags,
        websitesData: action.payload,
      };

      // get default show columns
      const defaultShowColumns = Object.keys(columns).filter(
        (column) => columns[column]['showColumn'],
      );
      updatedState['defaultShowColumns'] = defaultShowColumns;

      // get showColumns from URL
      if (!state.websitesDataLoaded) {
        updatedState['showColumns'] = defaultShowColumns;
        getShowColumnsFromUrl();
      }

      function getShowColumnsFromUrl() {
        const showColumns = getQueryParamValue('showColumns');
        // if URL doesn't contain parameter
        if (!showColumns) return;

        const renderableColumns = Object.keys(columns).filter(
          (column) => columns[column]['renderColumn'],
        );
        const filteredColumns = showColumns
          .split(',')
          .filter((column) => renderableColumns.includes(column));
        if (filteredColumns.length > 0) {
          updatedState['showColumns'] = filteredColumns;
        }
      }

      return updatedState;
    }
    case WEBSITES_DATA_LOADED:
      return {
        ...state,
        websitesDataLoaded: action.payload,
      };
    case SORT_UPDATED:
      return {
        ...state,
        sort: {
          ...state.sort,
          ...action.payload,
        },
      };
    case FILTERS_UPDATED:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case CLEAR_FILTERS: {
      const filters = {};
      for (const k in state.filters) {
        if (k === 'tags') filters[k] = [];
        else filters[k] = '';
      }
      return {
        ...state,
        filters,
        sort: {
          column: '',
          direction: '',
        },
      };
    }
    case PREPARED_DATA_UPDATED:
      return {
        ...state,
        preparedData: action.payload,
        availableTags: getUniqueTags(action.payload),
      };
    case SHOWED_COLUMNS_UPDATED: {
      const { columns } = state.websitesData;
      return {
        ...state,
        showColumns: action.payload
          .filter((column) => Object.keys(columns).includes(column))
          .sort(
            (a, b) =>
              Object.keys(columns).indexOf(a) - Object.keys(columns).indexOf(b),
          ),
      };
    }
    default:
      return state;
  }
}
