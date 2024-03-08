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
  showedColumns: [],
  allTags: [],
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
      // collect all tags
      const allTags = [];
      websites.forEach((website) => {
        website['tags'].forEach((tag) => {
          if (!allTags.includes(tag)) {
            allTags.push(tag);
          }
        });
      });
      const updatedState = {
        ...state,
        filters,
        allTags,
        websitesData: action.payload,
      };
      if (!state.websitesDataLoaded) {
        updatedState['showedColumns'] = Object.keys(columns).filter(
          (column) => columns[column]['showColumn'],
        );
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
      };
    case SHOWED_COLUMNS_UPDATED: {
      const { columns } = state.websitesData;
      return {
        ...state,
        showedColumns: action.payload
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
