import { HIDE_TOAST, SHOW_TOAST } from './toast.constants';

export function showToast(message, type = 'default') {
  return {
    type: SHOW_TOAST,
    payload: {
      message,
      type,
      id: `${Date.now()}-${Math.random()}`,
    },
  };
}

export function hideToast() {
  return {
    type: HIDE_TOAST,
  };
}
