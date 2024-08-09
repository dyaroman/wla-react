import { useDispatch, useSelector } from 'react-redux';

import { toggleSidebarOpen } from '../features/app/app.actions';

export function Burger() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state['app'].sidebarOpen);

  function onClick() {
    dispatch(toggleSidebarOpen(!sidebarOpen));
  }

  return (
    <button
      className={'burger' + (sidebarOpen ? ' burger--open' : '')}
      onClick={onClick}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
