import { useDispatch } from 'react-redux';
import { openDrawer } from '../features/drawer/drawer.actions';
import { SIDEBAR } from '../features/drawer/drawer.constants';

export function Burger() {
  const dispatch = useDispatch();

  function onClick() {
    dispatch(openDrawer(SIDEBAR));
  }

  return (
    <button className="burger" onClick={onClick} data-qa="burger">
      <span />
      <span />
      <span />
    </button>
  );
}
