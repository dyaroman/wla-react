import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '../features/drawer/drawer.actions';
import { SIDEBAR } from '../features/drawer/drawer.constants';

export function Burger() {
  const dispatch = useDispatch();
  const openDrawerId = useSelector((state) => state['drawer'].openDrawerId);

  function onClick() {
    dispatch(openDrawer(SIDEBAR));
  }

  return (
    <button
      className={'burger' + (openDrawerId === SIDEBAR ? ' burger--open' : '')}
      onClick={onClick}
      data-qa="burger"
    >
      <span />
      <span />
      <span />
    </button>
  );
}
