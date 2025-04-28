import { useDispatch, useSelector } from 'react-redux';

import { TOGGLE_SIDEBAR_OPENED } from '../features/app/app.constants';

export function Burger() {
  const dispatch = useDispatch();
  const sidebarOpened = useSelector((state) => state['app'].sidebarOpened);

  function onClick() {
    dispatch({
      type: TOGGLE_SIDEBAR_OPENED,
      payload: !sidebarOpened,
    });
  }

  return (
    <button
      className={'burger' + (sidebarOpened ? ' burger--open' : '')}
      onClick={onClick}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
