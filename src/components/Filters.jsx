import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterField } from './FilterField';
import { TagsFilterField } from './TagsFilterField';
import {
  fromCamelCaseToWords,
  getQueryParamValue,
  triggerGtmEvent,
} from '../misc/functions';
import { useKeyPress } from '../hooks/useKeyPress';
import { toggleFiltersOpen } from '../features/app/app.actions';
import { clearFilters } from '../features/table/table.actions';
import { BTN_GTM_EVENT, SHORTCUT_GTM_EVENT } from '../misc/gtm.constants';
import { FILTERS_OPEN, TAGS } from '../misc/url.constants';

export function Filters() {
  const dispatch = useDispatch();
  const filtersOpen = useSelector((state) => state['app'].filtersOpen);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const columns = websitesData['columns'];

  useEffect(() => {
    if (getQueryParamValue(FILTERS_OPEN) === '') {
      dispatch(toggleFiltersOpen(true));
    }
  }, []);

  useKeyPress('meta+shift+f', (event) => {
    event.preventDefault();
    onSearchShortcut();
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'search',
      label: 'macos',
    });
  });
  useKeyPress('ctrl+shift+f', (event) => {
    event.preventDefault();
    onSearchShortcut();
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'search',
      label: 'windows',
    });
  });

  useKeyPress('meta+shift+c', (event) => {
    event.preventDefault();
    onCopyShortcut();
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'copy-websites',
      label: 'macos',
    });
  });
  useKeyPress('ctrl+shift+c', (event) => {
    event.preventDefault();
    onCopyShortcut();
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'copy-websites',
      label: 'windows',
    });
  });

  useKeyPress('meta+shift+r', (event) => {
    event.preventDefault();
    onClearClick();
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'clear-all',
      label: 'macos',
    });
  });
  useKeyPress('ctrl+shift+r', (event) => {
    event.preventDefault();
    onClearClick();
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'clear-all',
      label: 'windows',
    });
  });

  if (websitesData['websites'].length === 0) {
    return null;
  }

  function onSearchShortcut() {
    if (!filtersOpen) {
      dispatch(toggleFiltersOpen(true));
    }
    setTimeout(() => {
      document.querySelector('input').select();
    });
  }

  async function onCopyShortcut() {
    const formattedWebsitesList = preparedData
      .map((website) => website['website'])
      .join(',');
    await handleClipboardCopy(formattedWebsitesList);
  }

  async function onCopyWebsitesClick() {
    const formattedWebsitesList = preparedData
      .map((website) => website['website'])
      .join('\n');
    await handleClipboardCopy(formattedWebsitesList);

    triggerGtmEvent(BTN_GTM_EVENT, {
      method: 'copy-websites',
    });
  }

  async function onCopyWebsitesUrlsClick() {
    const websitesUrls = preparedData
      .map((website) => `https://${website['host']}/`)
      .join('\n');
    await handleClipboardCopy(websitesUrls);

    triggerGtmEvent(BTN_GTM_EVENT, {
      method: 'copy-websites-urls',
    });
  }

  async function handleClipboardCopy(data) {
    try {
      await navigator.clipboard.writeText(data);
    } catch (e) {
      console.log(`Error due to copy websites list to clipboard`, e);
    }
  }

  function onClearClick() {
    dispatch(clearFilters());

    triggerGtmEvent(BTN_GTM_EVENT, {
      method: 'clear-all',
    });
  }

  function onSummaryClick(event) {
    event.preventDefault();
    dispatch(toggleFiltersOpen(!filtersOpen));
  }

  return (
    <details open={filtersOpen} className="filters">
      <summary onClick={onSummaryClick}>Filters:</summary>
      <div className="filters__content">
        {Object.keys(columns).map((column) => {
          if (column === TAGS || !columns[column]['renderFilter']) return null;
          return (
            <FilterField
              key={column}
              name={column}
              placeholder={fromCamelCaseToWords(column)}
            />
          );
        })}
        {Object.keys(columns).includes(TAGS) && <TagsFilterField />}
      </div>
      <div className="btn-group">
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
    </details>
  );
}
