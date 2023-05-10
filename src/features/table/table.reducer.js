import {
  CLEAR_FILTERS,
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SORT_UPDATED,
  WEBSITES_DATA_LOADED,
} from './table.constants';

const initialFilters = {
  filters: {
    address1: '',
    address2: '',
    altForm: '',
    altFormTheme: '',
    altFormLeadType: '',
    campaignId: '',
    companyName: '',
    county: '',
    effectiveDate: '',
    email: '',
    emailLegal: '',
    gtmKey: '',
    mainForm: '',
    mainFormTheme: '',
    mainFormLeadType: '',
    mainFormEs: '',
    mainFormEsTheme: '',
    mainFormEsLeadType: '',
    owner: '',
    state: '',
    tags: [],
    template: '',
    website: '',
  },
};
const initialSorts = {
  sort: {
    column: '',
    direction: '',
  },
};
const tableInitialState = {
  ...initialFilters,
  ...initialSorts,
  websitesData: null,
  websitesDataLoaded: false,
  preparedData: [],
};

export function tableReducer(state = tableInitialState, action) {
  switch (action.type) {
    case SET_WEBSITES_DATA:
      return {
        ...state,
        websitesData: action.payload,
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
        ...initialFilters,
        ...initialSorts,
      };
    case PREPARED_DATA_UPDATED:
      return {
        ...state,
        preparedData: action.payload,
      };
    default:
      return state;
  }
}
