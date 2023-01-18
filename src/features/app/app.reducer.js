import { TOGGLE_INFO_MODAL, TOGGLE_THEME } from './app.constants';

const appInitialState = {
  infoModalOpen: false,
  theme: 'light',
};

export function appReducer(state = appInitialState, action) {
  switch (action.type) {
    case TOGGLE_INFO_MODAL:
      return {
        ...state,
        infoModalOpen: action.payload,
      };
    case TOGGLE_THEME:
      return {
        ...state,
        theme: action.payload === 'dark' ? 'dark' : 'light',
      };
    default:
      return state;
  }
}
