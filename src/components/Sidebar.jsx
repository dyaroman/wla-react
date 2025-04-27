import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Burger } from './Burger';
import { AppControls } from './AppControls';
import { TableInfo } from './TableInfo';
import { Filters } from './Filters';
import { Tags } from './Tags';
import { ResultsControls } from './ResultsControls';
import { TableControls } from './TableControls';
import { Logo } from './Logo';
import { Counter } from './Counter';
import { triggerGtmEvent } from '../misc/functions';
import { useShortcut } from '../hooks/useShortcut';
import { toggleSidebarOpen } from '../features/app/app.actions';
import { gtmEvents } from '../misc/gtm.constants';

// todo: replace with Drawer position top
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
  useShortcut(['CommandOrControl', '/'], (event) => {
    dispatch(toggleSidebarOpen(!sidebarOpen));
    triggerGtmEvent(gtmEvents.shortcut, {
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
          <div className="sidebar__panels">
            <div>
              <TableInfo />
              <Filters />
              <Tags />
              <ResultsControls />
            </div>
            <div>
              <TableControls />
              <AppControls />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
