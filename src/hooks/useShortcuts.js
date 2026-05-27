import { useDispatch, useSelector } from 'react-redux';

import { useShortcut } from './useShortcut';
import {
  convertUrlToEnv,
  getQueryParamValue,
  handleClipboardCopy,
  triggerGtmEvent,
} from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';
import { showToast } from '../features/toast/toast.slice';
import { resetFilters } from '../features/table/table.actions';
import { openDrawer } from '../features/drawer/drawer.slice';
import { COLUMNS } from '../misc/columns.constants';
import { toggleInfoModalOpened } from '../features/app/app.slice';
import { FILTERS, SIDEBAR } from '../features/drawer/drawer.constants';

export function useShortcuts() {
  const dispatch = useDispatch();
  const websitesData = useSelector((state) => state['table'].websitesData);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const infoModalOpened = useSelector((state) => state['app'].infoModalOpened);

  const env = websitesData?.['env'];
  const convertLinksTo =
    getQueryParamValue('convertLinksTo') || getQueryParamValue('clt');
  const convertLinks = convertLinksTo && convertLinksTo !== env;

  // copy websites as a comma-separated list
  useShortcut(['CommandOrControl', 'Shift', 'C'], async (event) => {
    event.preventDefault();

    const formattedWebsitesList = preparedData
      .map((website) => website[COLUMNS.website])
      .join(',');

    handleClipboardCopy(formattedWebsitesList);

    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'copy-websites',
    });

    dispatch(showToast('websites list copied', 'success'));
  });

  // copy websites urls
  useShortcut(['Shift', 'Alt', 'C'], async (event) => {
    event.preventDefault();

    const websitesUrls = preparedData
      .map((website) => {
        const host =
          (convertLinks &&
            convertUrlToEnv(website[COLUMNS.website], convertLinksTo)) ||
          website[COLUMNS.host];

        return `https://${host}/`;
      })
      .join('\n');

    handleClipboardCopy(websitesUrls);

    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'copy-websites-urls',
    });

    dispatch(showToast('websites urls copied', 'success'));
  });

  // clear filters
  useShortcut(['CommandOrControl', 'Shift', 'E'], (event) => {
    event.preventDefault();

    dispatch(resetFilters());

    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'clear-filters',
      label: event.ctrlKey ? 'windows' : 'macos',
    });

    dispatch(showToast('filters reset', 'success'));
  });

  // toggle header's drawer
  useShortcut(['CommandOrControl', '/'], (event) => {
    dispatch(openDrawer(SIDEBAR));
    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'sidebar-open',
      label: event.ctrlKey ? 'windows' : 'macos',
    });
  });

  // open info modal
  useShortcut(['Shift', '/'], (event) => {
    event.preventDefault();

    dispatch(toggleInfoModalOpened(!infoModalOpened));

    triggerGtmEvent(gtmEvents.openInfoModal);

    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'open-info-modal',
    });
  });

  // search
  useShortcut(['CommandOrControl', 'Shift', 'F'], (event) => {
    event.preventDefault();

    dispatch(openDrawer(FILTERS));
    setTimeout(() => {
      document.querySelector('input')?.select();
    }, 300);

    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'search',
      label: event.ctrlKey ? 'windows' : 'macos',
    });
  });
}
