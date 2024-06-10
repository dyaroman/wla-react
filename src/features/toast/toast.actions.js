import { HIDE_TOAST, SET_CURRENT_TOAST, SHOW_TOAST } from './toast.constants';

export function showToast(message) {
  return {
    type: SHOW_TOAST,
    payload: message,
  };
}

export function hideToast() {
  return {
    type: HIDE_TOAST,
  };
}

export function setCurrentToast(toast) {
  return {
    type: SET_CURRENT_TOAST,
    payload: toast,
  };
}
