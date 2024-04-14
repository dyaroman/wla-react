import {
  CLEAR_FILTERS,
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SHOWED_COLUMNS_UPDATED,
  SORT_UPDATED,
  WEBSITES_DATA_LOADED,
} from './table.constants';

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
    case SET_WEBSITES_DATA:
      return {
        ...state,
        ...action.payload,
      };
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
    case CLEAR_FILTERS:
      return {
        ...state,
        ...action.payload,
      };
    case PREPARED_DATA_UPDATED:
      return {
        ...state,
        ...action.payload,
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
