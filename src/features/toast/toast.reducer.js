import { HIDE_TOAST, SHOW_TOAST } from './toast.constants';

const toastInitialState = {
  active: [],
  queue: [],
};

export function toastReducer(state = toastInitialState, action) {
  switch (action.type) {
    case HIDE_TOAST:
      // Remove the first toast from active
      const newActive = state.active.slice(1);

      // If we have space in active and items in the queue, move one from queue to active
      let newQueue = [...state.queue];
      if (newActive.length < 3 && newQueue.length > 0) {
        newActive.push(newQueue[0]);
        newQueue = newQueue.slice(1);
      }

      return {
        ...state,
        active: newActive,
        queue: newQueue,
      };

    case SHOW_TOAST:
      // If we have space in active, add the toast there, otherwise add to the queue
      if (state.active.length < 3) {
        return {
          ...state,
          active: [...state.active, action.payload],
        };
      } else {
        return {
          ...state,
          queue: [...state.queue, action.payload],
        };
      }

    default:
      return state;
  }
}
