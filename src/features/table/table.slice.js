import { createSlice } from '@reduxjs/toolkit';

import { filterAndSortColumns } from '../../misc/functions';

export const ASC = 'asc';
export const DESC = 'desc';

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    allTags: [],
    autocompleteLists: [],
    availableTags: [],
    checkboxes: [],
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
  },
  reducers: {
    checkboxToggled(state, action) {
      const idx = state.checkboxes.indexOf(action.payload);
      if (idx > -1) {
        state.checkboxes.splice(idx, 1);
      } else {
        state.checkboxes.push(action.payload);
      }
    },

    computedDataUpdated(state, action) {
      state.availableTags = action.payload.availableTags;
      state.autocompleteLists = action.payload.autocompleteLists;
      state.preparedData = action.payload.preparedData;
    },

    currentPageUpdated(state, action) {
      state.currentPage = action.payload;
    },

    filtersUpdated(state, action) {
      Object.assign(state.filters, action.payload);
    },

    perPageUpdated(state, action) {
      state.perPage = action.payload;
    },

    setWebsitesData(state, action) {
      state.allTags = action.payload.allTags;
      state.availableTags = action.payload.availableTags;
      state.defaultShowColumns = action.payload.defaultShowColumns;
      state.filters = action.payload.filters;
      state.renderableColumns = action.payload.renderableColumns;
      state.showColumns = action.payload.showColumns;
      state.websitesData = action.payload.websitesData;
      state.websitesDataETag = action.payload.websitesDataETag;
      state.websitesDataLoaded = action.payload.websitesDataLoaded;
    },

    showColumnsUpdated(state, action) {
      state.showColumns = filterAndSortColumns(action.payload, state);
    },

    sortUpdated(state, action) {
      Object.assign(state.sort, action.payload);
    },

    tagsUpdated(state, action) {
      state.tags = action.payload;
    },

    urlParamsCombinedUpdate(state, action) {
      if (action.payload.currentPage != null) {
        state.currentPage = action.payload.currentPage;
      }
      Object.assign(state.filters, action.payload.filters);
      if (action.payload.perPage != null) {
        state.perPage = action.payload.perPage;
      }
      state.showColumns = filterAndSortColumns(
        action.payload.showColumns,
        state,
      );
      Object.assign(state.sort, action.payload.sort);
      state.tags = action.payload.tags;
      state.urlParamsRead = action.payload.urlParamsRead;
    },

    urlParamsRead(state, action) {
      state.urlParamsRead = action.payload;
    },

    websitesDataLoaded(state, action) {
      state.websitesDataLoaded = action.payload;
    },

    websitesDataSource(state, action) {
      state.websitesDataSource = action.payload;
    },
  },
});

export const {
  checkboxToggled,
  computedDataUpdated,
  currentPageUpdated,
  filtersUpdated,
  perPageUpdated,
  setWebsitesData,
  showColumnsUpdated,
  sortUpdated,
  tagsUpdated,
  urlParamsCombinedUpdate,
  urlParamsRead,
  websitesDataLoaded,
  websitesDataSource,
} = tableSlice.actions;

export const tableReducer = tableSlice.reducer;
