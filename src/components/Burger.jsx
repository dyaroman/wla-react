import { useDispatch, useSelector } from 'react-redux';

import { TOGGLE_HEADER_DRAWER_OPENED } from '../features/app/app.constants';

export function Burger() {
  const dispatch = useDispatch();
  const headerOpened = useSelector((state) => state['app'].headerOpened);

  function onClick() {
    dispatch({
      type: TOGGLE_HEADER_DRAWER_OPENED,
      payload: !headerOpened,
    });
  }

  return (
    <button
      className={'burger' + (headerOpened ? ' burger--open' : '')}
      onClick={onClick}
      data-qa="burger"
    >
      <span />
      <span />
      <span />
    </button>
  );
}
