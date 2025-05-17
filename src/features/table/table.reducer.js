import {
  COMPUTED_DATA_UPDATED,
  CURRENT_PAGE_UPDATED,
  FILTERS_UPDATED,
  PER_PAGE_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SHOW_COLUMNS_UPDATED,
  SORT_UPDATED,
  TAGS_UPDATED,
  URL_PARAMS_COMBINED_UPDATE,
  URL_PARAMS_READ,
  WEBSITES_DATA_LOADED,
  WEBSITES_DATA_SOURCE,
} from './table.constants';
import { filterAndSortColumns } from '../../misc/functions';

const tableInitialState = {
  allTags: [],
  autocompleteLists: [],
  availableTags: [],
  currentPage: 1,
  defaultShowColumns: [],
  filters: {},
  perPage: 25,
  preparedData: [],
  renderableColumns: [],
  showColumns: [],
  sort: { column: '', direction: '' },
  tags: [],
  urlParamsRead: false,
  websitesData: null,
  websitesDataETag: null,
  websitesDataLoaded: false,
  websitesDataSource: '',
};

export function tableReducer(state = tableInitialState, action) {
  switch (action.type) {
    case COMPUTED_DATA_UPDATED:
      return {
        ...state,
        availableTags: action.payload.availableTags,
        autocompleteLists: action.payload.autocompleteLists,
        preparedData: action.payload.preparedData,
      };

    case CURRENT_PAGE_UPDATED:
      return {
        ...state,
        currentPage: action.payload,
      };

    case FILTERS_UPDATED:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case PER_PAGE_UPDATED:
      return {
        ...state,
        perPage: action.payload,
      };

    case PREPARED_DATA_UPDATED:
      return {
        ...state,
        preparedData: action.payload.preparedData,
      };

    case SET_WEBSITES_DATA:
      return {
        ...state,
        allTags: action.payload.allTags,
        availableTags: action.payload.availableTags,
        defaultShowColumns: action.payload.defaultShowColumns,
        filters: action.payload.filters,
        renderableColumns: action.payload.renderableColumns,
        showColumns: action.payload.showColumns,
        websitesData: action.payload.websitesData,
        websitesDataETag: action.payload.websitesDataETag,
        websitesDataLoaded: action.payload.websitesDataLoaded,
      };

    case SHOW_COLUMNS_UPDATED:
      return {
        ...state,
        showColumns: filterAndSortColumns(action.payload, state),
      };

    case SORT_UPDATED:
      return {
        ...state,
        sort: {
          ...state.sort,
          ...action.payload,
        },
      };

    case TAGS_UPDATED:
      return {
        ...state,
        tags: action.payload,
      };

    case URL_PARAMS_COMBINED_UPDATE:
      return {
        ...state,
        currentPage: action.payload.currentPage ?? state.currentPage,
        filters: {
          ...state.filters,
          ...action.payload.filters,
        },
        perPage: action.payload.perPage ?? state.perPage,
        showColumns: filterAndSortColumns(action.payload.showColumns, state),
        sort: {
          ...state.sort,
          ...action.payload.sort,
        },
        tags: action.payload.tags,
        urlParamsRead: action.payload.urlParamsRead,
      };

    case URL_PARAMS_READ:
      return {
        ...state,
        urlParamsRead: action.payload,
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

    default:
      return state;
  }
}
