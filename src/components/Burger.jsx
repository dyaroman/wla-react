import { useDispatch, useSelector } from 'react-redux';

import { TOGGLE_HEADER_DRAWER_OPENED } from '../features/app/app.constants';

export function Burger() {
  const dispatch = useDispatch();
  const headerDrawerOpened = useSelector(
    (state) => state['app'].headerDrawerOpened,
  );

  function onClick() {
    dispatch({
      type: TOGGLE_HEADER_DRAWER_OPENED,
      payload: !headerDrawerOpened,
    });
  }

  return (
    <button
      className={'burger' + (headerDrawerOpened ? ' burger--open' : '')}
      onClick={onClick}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
