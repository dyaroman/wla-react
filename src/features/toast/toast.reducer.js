import { HIDE_TOAST, SET_CURRENT_TOAST, SHOW_TOAST } from './toast.constants';

const toastInitialState = {
  current: null,
  queue: [],
};

export function toastReducer(state = toastInitialState, action) {
  switch (action.type) {
    case HIDE_TOAST:
      return {
        ...state,
        current: null,
        queue: state.queue.slice(1),
      };

    case SET_CURRENT_TOAST:
      return {
        ...state,
        current: action.payload,
      };

    case SHOW_TOAST:
      return {
        ...state,
        queue: [...state.queue, action.payload],
      };

    default:
      return state;
  }
}
