import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Burger } from './Burger';
import { AppControls } from './AppControls';
import { TableInfo } from './TableInfo';
import { Filters } from './Filters';
import { TableControls } from './TableControls';
import { Logo } from './Logo';
import { Counter } from './Counter';
import { triggerGtmEvent } from '../misc/functions';
import { useKeyPress } from '../hooks/useKeyPress';
import { toggleSidebarOpen } from '../features/app/app.actions';
import { SHORTCUT_GTM_EVENT } from '../misc/gtm.constants';

export function Sidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state['app'].sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarOpen]);

  // toggle sidebar
  useKeyPress(['CommandOrControl', '/'], (event) => {
    dispatch(toggleSidebarOpen(!sidebarOpen));
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'sidebar-' + (sidebarOpen ? 'close' : 'open'),
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
          <AppControls />
          <TableInfo />
          <div className="sidebar__panels">
            <Filters />
            <TableControls />
          </div>
        </div>
      </div>
    </aside>
  );
}
