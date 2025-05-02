import { useDispatch, useSelector } from 'react-redux';

import { useShortcut } from '../hooks/useShortcut';
import {
  convertUrlToEnv,
  getQueryParamValue,
  handleClipboardCopy,
  triggerGtmEvent,
} from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';
import { showToast } from '../features/toast/toast.actions';
import { resetFilters } from '../features/table/table.actions';
import { COLUMNS } from '../misc/columns.constants';
import {
  TOGGLE_FILTERS_OPENED,
  TOGGLE_HEADER_DRAWER_OPENED,
  TOGGLE_INFO_MODAL_OPENED,
} from '../features/app/app.constants';

export function Shortcuts() {
  const dispatch = useDispatch();
  const websitesData = useSelector((state) => state['table'].websitesData);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const headerDrawerOpened = useSelector(
    (state) => state['app'].headerDrawerOpened,
  );
  const infoModalOpened = useSelector((state) => state['app'].infoModalOpened);
  const filtersOpened = useSelector((state) => state['app'].filtersOpened);

  const env = websitesData['env'];
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

  // clear filters and sort
  useShortcut(['CommandOrControl', 'Shift', 'E'], (event) => {
    event.preventDefault();

    dispatch(resetFilters());

    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'clear-all',
      label: event.ctrlKey ? 'windows' : 'macos',
    });

    dispatch(showToast('filters and sort cleared', 'success'));
  });

  // toggle header's drawer
  useShortcut(['CommandOrControl', '/'], (event) => {
    dispatch({
      type: TOGGLE_HEADER_DRAWER_OPENED,
      payload: !headerDrawerOpened,
    });
    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'header-drawer-' + (headerDrawerOpened ? 'close' : 'open'),
      label: event.ctrlKey ? 'windows' : 'macos',
    });
  });

  // open info modal
  useShortcut(['Shift', '/'], (event) => {
    event.preventDefault();

    dispatch({
      type: TOGGLE_INFO_MODAL_OPENED,
      payload: !infoModalOpened,
    });

    triggerGtmEvent(gtmEvents.openInfoModal);

    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'open-info-modal',
    });
  });

  // search
  useShortcut(['CommandOrControl', 'Shift', 'F'], (event) => {
    event.preventDefault();

    if (!filtersOpened) {
      dispatch({
        type: TOGGLE_FILTERS_OPENED,
        payload: true,
      });
    }
    setTimeout(() => {
      document.querySelector('input')?.select();
    }, 300);

    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'search',
      label: event.ctrlKey ? 'windows' : 'macos',
    });
  });
}
