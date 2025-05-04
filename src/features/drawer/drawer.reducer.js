import { CLOSE_DRAWER, OPEN_DRAWER } from './drawer.constants';

const initialState = {
  openDrawerId: null,
};

export function drawerReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_DRAWER:
      return {
        ...state,
        openDrawerId: action.payload,
      };

    case CLOSE_DRAWER:
      return {
        ...state,
        openDrawerId: null,
      };

    default:
      return state;
  }
}
