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
import { SHOW_COLUMNS, TAGS } from '../../misc/url.constants';

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
  renderableColumns: [],
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
          if (column === TAGS) filters[column] = [];
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

      // get renderable columns
      const renderableColumns = Object.keys(columns).filter(
        (column) => columns[column]['renderColumn'],
      );
      updatedState['renderableColumns'] = renderableColumns;

      // get showColumns from URL
      if (!state.websitesDataLoaded) {
        updatedState[SHOW_COLUMNS] = defaultShowColumns;
        getShowColumnsFromUrl();
      }

      function getShowColumnsFromUrl() {
        const showColumns = getQueryParamValue(SHOW_COLUMNS);
        // if URL doesn't contain parameter
        if (!showColumns) return;

        // if showColumns equal to alias 'all'
        // show all renderable columns
        if (showColumns === 'all') {
          updatedState[SHOW_COLUMNS] = renderableColumns;
          return;
        }

        // if shownColumns equal to alias 'none'
        // hide all columns
        if (showColumns === 'none') {
          updatedState[SHOW_COLUMNS] = [];
          return;
        }

        const filteredColumns = showColumns
          .split(',')
          .filter((column) => renderableColumns.includes(column));
        if (filteredColumns.length > 0) {
          updatedState[SHOW_COLUMNS] = filteredColumns;
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
        if (k === TAGS) filters[k] = [];
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
