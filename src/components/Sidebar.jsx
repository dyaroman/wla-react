import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Burger } from './Burger';
import { AppControls } from './AppControls';
import { TableInfo } from './TableInfo';
import { Filters } from './Filters';
import { TableControls } from './TableControls';
import { Logo } from './Logo';
import { Counter } from './Counter';
import { getQueryParamValue, triggerGtmEvent } from '../misc/functions';
import { useKeyPress } from '../hooks/useKeyPress';
import { toggleSidebarOpen } from '../features/app/app.actions';
import { SIDEBAR_OPEN } from '../misc/url.constants';
import { SHORTCUT_GTM_EVENT } from '../misc/gtm.constants';

export function Sidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state['app'].sidebarOpen);

  useEffect(() => {
    if (getQueryParamValue(SIDEBAR_OPEN) === '') {
      dispatch(toggleSidebarOpen(true));
    }
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarOpen]);

  useKeyPress('meta+/', () => {
    dispatch(toggleSidebarOpen(!sidebarOpen));
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'sidebar-' + (sidebarOpen ? 'close' : 'open'),
      label: 'macos',
    });
  });

  useKeyPress('ctrl+/', () => {
    dispatch(toggleSidebarOpen(!sidebarOpen));
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'sidebar-' + (sidebarOpen ? 'close' : 'open'),
      label: 'windows',
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
          <Filters />
          <TableControls />
        </div>
      </div>
    </aside>
  );
}
