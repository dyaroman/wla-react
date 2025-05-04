import { CLOSE_DRAWER, OPEN_DRAWER } from './drawer.constants';

export function openDrawer(drawerId) {
  return {
    type: OPEN_DRAWER,
    payload: drawerId,
  };
}

export function closeDrawer() {
  return {
    type: CLOSE_DRAWER,
  };
}
