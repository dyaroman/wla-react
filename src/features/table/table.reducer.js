import {
  COMPUTED_DATA_UPDATED,
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SHOW_COLUMNS_UPDATED,
  SORT_UPDATED,
  TAGS_UPDATED,
  URL_PARAMS_COMBINED_UPDATE,
  WEBSITES_DATA_LOADED,
  WEBSITES_DATA_SOURCE,
} from './table.constants';

const tableInitialState = {
  filters: {},
  tags: [],
  allTags: [],
  availableTags: [],
  sort: {
    column: '',
    direction: '',
  },
  websitesData: null,
  websitesDataETag: null,
  websitesDataLoaded: false,
  websitesDataSource: '',
  preparedData: [],
  showColumns: [],
  defaultShowColumns: [],
  renderableColumns: [],
  autocompleteLists: [],
};

export function tableReducer(state = tableInitialState, action) {
  // todo: reorder in import order
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

    case WEBSITES_DATA_SOURCE:
      return {
        ...state,
        websitesDataSource: action.payload,
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

    case TAGS_UPDATED:
      return {
        ...state,
        tags: action.payload,
      };

    case COMPUTED_DATA_UPDATED:
      return {
        ...state,
        availableTags: action.payload.availableTags,
        autocompleteLists: action.payload.autocompleteLists,
        preparedData: action.payload.preparedData,
      };

    case PREPARED_DATA_UPDATED:
      return {
        ...state,
        preparedData: action.payload.preparedData,
      };

    case SHOW_COLUMNS_UPDATED:
      return {
        ...state,
        showColumns: action.payload,
      };

    case URL_PARAMS_COMBINED_UPDATE:
      return {
        ...state,
        sort: {
          ...state.sort,
          ...action.payload.sort,
        },
        filters: {
          ...state.filters,
          ...action.payload.filters,
        },
        tags: action.payload.tags,
        showColumns: action.payload.showColumns,
      };

    default:
      return state;
  }
}
