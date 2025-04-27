import { useDispatch, useSelector } from 'react-redux';

import { toggleSidebarOpened } from '../features/app/app.actions';

export function Burger() {
  const dispatch = useDispatch();
  const sidebarOpened = useSelector((state) => state['app'].sidebarOpened);

  function onClick() {
    dispatch(toggleSidebarOpened(!sidebarOpened));
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
