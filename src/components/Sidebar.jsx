import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Burger } from './Burger';
import { AppControls } from './AppControls';
import { TableInfo } from './TableInfo';
import { ResultsControls } from './ResultsControls';
import { Logo } from './Logo';
import { Counter } from './Counter';
import { triggerGtmEvent } from '../misc/functions';
import { useShortcut } from '../hooks/useShortcut';
import { gtmEvents } from '../misc/gtm.constants';
import { TOGGLE_SIDEBAR_OPENED } from '../features/app/app.constants';

// todo: replace with Drawer position top
export function Sidebar() {
  const dispatch = useDispatch();
  const sidebarOpened = useSelector((state) => state['app'].sidebarOpened);

  useEffect(() => {
    if (sidebarOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpened]);

  // toggle sidebar
  useShortcut(['CommandOrControl', '/'], (event) => {
    dispatch({
      type: TOGGLE_SIDEBAR_OPENED,
      payload: !sidebarOpened,
    });
    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'sidebar-' + (sidebarOpened ? 'close' : 'open'),
      label: event.ctrlKey ? 'windows' : 'macos',
    });
  });

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <Logo />
        <Counter />
        <Burger />
      </div>
      <div className="sidebar__bottom">
        <div className="sidebar__bottom-content">
          <div className="sidebar__panels">
            <TableInfo />
            <ResultsControls />
            <AppControls />
          </div>
        </div>
      </div>
    </aside>
  );
}
