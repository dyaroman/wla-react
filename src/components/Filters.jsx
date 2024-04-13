import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterField } from './FilterField';
import { TagsFilterField } from './TagsFilterField';
import { CLEAR_FILTERS } from '../features/table/table.constants';
import { TOGGLE_FILTERS_COLLAPSE } from '../features/app/app.constants';
import {
  fromCamelCaseToWords,
  getQueryParamValue,
  triggerGtmEvent,
} from '../misc/functions';
import { useKeyPress } from '../hooks/useKeyPress';
import {
  CLEAR_FILTERS_BTN,
  COPY_WEBSITES_BTN,
  SHORTCUT,
} from '../misc/gtm.constants';
import { FILTERS_OPEN, TAGS } from '../misc/url.constants';

export function Filters() {
  const dispatch = useDispatch();
  const filtersCollapse = useSelector((state) => state['app'].filtersCollapse);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const { columns } = websitesData;
  const [copyWebsitesBtnText, setCopyWebsitesBtnText] = useState('copy');

  useEffect(() => {
    const filtersOpen = getQueryParamValue(FILTERS_OPEN);
    if (filtersOpen === '') {
      dispatch({
        type: TOGGLE_FILTERS_COLLAPSE,
        payload: false,
      });
    }
  }, []);

  useKeyPress('meta+shift+f', (event) => {
    event.preventDefault();
    onSearchShortcut();
    triggerGtmEvent(SHORTCUT, {
      method: 'search',
      label: 'macos',
    });
  });
  useKeyPress('ctrl+shift+f', (event) => {
    event.preventDefault();
    onSearchShortcut();
    triggerGtmEvent(SHORTCUT, {
      method: 'search',
      label: 'windows',
    });
  });

  useKeyPress('meta+shift+c', (event) => {
    event.preventDefault();
    onCopyShortcut();
    triggerGtmEvent(SHORTCUT, {
      method: 'copy-websites',
      label: 'macos',
    });
  });
  useKeyPress('ctrl+shift+c', (event) => {
    event.preventDefault();
    onCopyShortcut();
    triggerGtmEvent(SHORTCUT, {
      method: 'copy-websites',
      label: 'windows',
    });
  });

  if (websitesData['websites'].length === 0) {
    return null;
  }

  function onSearchShortcut() {
    if (filtersCollapse) {
      dispatch({
        type: TOGGLE_FILTERS_COLLAPSE,
        payload: false,
      });
    }
    setTimeout(() => {
      document.querySelector('input').select();
    });
  }

  async function onCopyShortcut() {
    const formattedWebsitesList = preparedData
      .map((e) => e['website'])
      .join(',');
    await handleClipboardCopy(formattedWebsitesList);
  }

  async function onCopyWebsitesClick() {
    const formattedWebsitesList = preparedData
      .map((e) => e['website'])
      .join('\n');
    await handleClipboardCopy(formattedWebsitesList);

    triggerGtmEvent(COPY_WEBSITES_BTN);
  }

  async function handleClipboardCopy(data) {
    try {
      await navigator.clipboard.writeText(data);
      setCopyWebsitesBtnText('copied');
    } catch (e) {
      console.log(`Error due to copy websites list to clipboard`, e);
    } finally {
      setTimeout(() => setCopyWebsitesBtnText('copy'), 1000);
    }
  }

  function onClearClick() {
    dispatch({
      type: CLEAR_FILTERS,
    });

    triggerGtmEvent(CLEAR_FILTERS_BTN);
  }

  function onSummaryClick(event) {
    event.preventDefault();
    dispatch({
      type: TOGGLE_FILTERS_COLLAPSE,
      payload: !filtersCollapse,
    });
  }

  return (
    <details open={!filtersCollapse} className="filters">
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
          <button
            className="btn"
            onClick={onCopyWebsitesClick}
            data-qa="copyWebsites"
          >
            {copyWebsitesBtnText} websites
          </button>
        )}
      </div>
    </details>
  );
}
