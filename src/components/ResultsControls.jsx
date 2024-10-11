import { useDispatch, useSelector } from 'react-redux';

import { useShortcut } from '../hooks/useShortcut';
import {
  convertUrlToEnv,
  getQueryParamValue,
  triggerGtmEvent,
} from '../misc/functions';
import { clearFilters } from '../features/table/table.actions';
import { showToast } from '../features/toast/toast.actions';
import { gtmEvents } from '../misc/gtm.constants';
import { COLUMNS } from '../misc/columns.constants';

export function ResultsControls() {
  const dispatch = useDispatch();
  const websitesData = useSelector((state) => state['table'].websitesData);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const env = websitesData['env'];
  const project = websitesData['project'];
  const convertLinksTo =
    getQueryParamValue('convertLinksTo') || getQueryParamValue('clt');
  const convertLinks = convertLinksTo && convertLinksTo !== env;

  // copy websites as comma separated list
  useShortcut(['CommandOrControl', 'Shift', 'C'], async (event) => {
    event.preventDefault();
    await onCopyShortcut();
    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'copy-websites',
    });
    dispatch(showToast('websites list copied'));
  });

  // copy websites urls
  useShortcut(['Shift', 'Alt', 'C'], async (event) => {
    event.preventDefault();
    await onCopyWebsitesUrlsClick();
    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'copy-websites-url',
    });
    dispatch(showToast('websites urls copied'));
  });

  // clear filters and sort
  useShortcut(['CommandOrControl', 'Shift', 'E'], (event) => {
    event.preventDefault();
    onClearClick();
    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'clear-all',
      label: event.ctrlKey ? 'windows' : 'macos',
    });
    dispatch(showToast('filters and sort cleared'));
  });

  async function onCopyShortcut() {
    const formattedWebsitesList = preparedData
      .map((website) => website[COLUMNS.website])
      .join(',');
    await handleClipboardCopy(formattedWebsitesList);
  }

  async function onCopyWebsitesUrlsClick() {
    const websitesUrls = preparedData
      .map((website) => {
        const host =
          (convertLinks &&
            convertUrlToEnv(
              website[COLUMNS.website],
              convertLinksTo,
              project,
            )) ||
          website[COLUMNS.host];

        return `https://${host}/`;
      })
      .join('\n');
    await handleClipboardCopy(websitesUrls);

    triggerGtmEvent(gtmEvents.btn, {
      method: 'copy-websites-urls',
    });
  }

  function onClearClick() {
    dispatch(clearFilters());

    triggerGtmEvent(gtmEvents.btn, {
      method: 'clear-all',
    });
  }

  async function onCopyWebsitesClick() {
    const formattedWebsitesList = preparedData
      .map((website) => website[COLUMNS.website])
      .join('\n');
    await handleClipboardCopy(formattedWebsitesList);

    triggerGtmEvent(gtmEvents.btn, {
      method: 'copy-websites',
    });
  }

  async function handleClipboardCopy(data) {
    try {
      await navigator.clipboard.writeText(data);
    } catch (e) {
      console.log(`Error due to copy websites list to clipboard`, e);
    }
  }

  return (
    <div className="btn-group  mt">
      <button
        className="btn btn--danger"
        onClick={onClearClick}
        data-qa="clearAll"
      >
        clear all
      </button>
      {preparedData.length !== 0 && (
        <>
          <button
            className="btn"
            onClick={onCopyWebsitesClick}
            data-qa="copyWebsites"
          >
            copy websites
          </button>
          <button
            className="btn"
            onClick={onCopyWebsitesUrlsClick}
            data-qa="copyWebsitesUrls"
          >
            copy websites urls
          </button>
        </>
      )}
    </div>
  );
}
