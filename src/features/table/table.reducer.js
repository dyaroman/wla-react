import {
  CLEAR_FILTERS,
  FILTERS_UPDATED,
  PREPARED_DATA_UPDATED,
  SET_WEBSITES_DATA,
  SORT_UPDATED,
  WEBSITES_DATA_LOADED,
  WEBSITES_DATA_UNAUTHORIZED_ERROR,
} from './table.constants';

const initialFilters = {
  filters: {
    address1: '',
    address2: '',
    altForm: '',
    altFormTheme: '',
    altLeadType: '',
    campaignId: '',
    companyName: '',
    county: '',
    effectiveDate: '',
    email: '',
    emailLegal: '',
    gtmKey: '',
    mainForm: '',
    mainFormTheme: '',
    mainLeadType: '',
    owner: '',
    recaptchaKey: '',
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
const initialState = {
  ...initialFilters,
  ...initialSorts,
  unauthorized: false,
  websitesData: null,
  websitesDataLoaded: false,
  preparedData: [],
};

export function tableReducer(state = initialState, action) {
  switch (action.type) {
    case WEBSITES_DATA_UNAUTHORIZED_ERROR:
      return {
        ...state,
        unauthorized: action.payload,
      };
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
