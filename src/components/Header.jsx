import { useDispatch, useSelector } from 'react-redux';

import { Burger } from './Burger';
import { TableInfo } from './TableInfo';
import { ResultsControls } from './ResultsControls';
import { Logo } from './Logo';
import { Counter } from './Counter';
import { Drawer } from './Drawer';
import { TOGGLE_HEADER_DRAWER_OPENED } from '../features/app/app.constants';

export function Header() {
  const dispatch = useDispatch();
  const headerDrawerOpened = useSelector(
    (state) => state['app'].headerDrawerOpened,
  );

  function onClose() {
    dispatch({
      type: TOGGLE_HEADER_DRAWER_OPENED,
      payload: !headerDrawerOpened,
    });
  }

  return (
    <header className="header">
      <div className="header__content">
        <Logo />
        <Counter />
        <Burger />
      </div>

      <Drawer
        position="left"
        isOpen={headerDrawerOpened}
        onClose={onClose}
        maxSize="300px"
        showHeader={false}
      >
        <TableInfo />
        {/*todo: rename this component*/}
        <ResultsControls />
      </Drawer>
    </header>
  );
}
