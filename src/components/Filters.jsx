import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterField } from './FilterField';
import { TagsFilterField } from './TagsFilterField';
import { CLEAR_FILTERS } from '../features/table/table.constants';
import { TOGGLE_FILTERS_COLLAPSE } from '../features/app/app.constants';
import { fromCamelCaseToWords } from '../misc/functions';
import { useKeyPress } from '../hooks/useKeyPress';

export function Filters() {
  const dispatch = useDispatch();
  const { filtersCollapse } = useSelector((state) => state['app']);
  const { preparedData, websitesData } = useSelector((state) => state['table']);
  const { columns } = websitesData;
  const [copyWebsitesBtnText, setCopyWebsitesBtnText] = useState('copy');

  useKeyPress('meta+shift+f', onSearchShortcut);
  useKeyPress('ctrl+shift+f', onSearchShortcut);

  useKeyPress('meta+shift+c', onCopyShortcut);
  useKeyPress('ctrl+shift+c', onCopyShortcut);

  if (websitesData['websites'].length === 0) {
    return null;
  }

  function onSearchShortcut(event) {
    event.preventDefault();
    if (filtersCollapse) {
      dispatch({
        type: TOGGLE_FILTERS_COLLAPSE,
        payload: false,
      });
    }
    setTimeout(() => {
      document.querySelector('input').focus();
      document.querySelector('input').select();
    }, 0);
  }

  async function onCopyShortcut(event) {
    event.preventDefault();
    const dataToCopy = preparedData.map((e) => e['website']).join(',');
    try {
      await navigator.clipboard.writeText(dataToCopy);
    } catch (e) {
      console.log(`Error due to copy websites list to clipboard`, e);
    }
  }

  function onClearClick() {
    dispatch({
      type: CLEAR_FILTERS,
    });
  }

  function onSummaryClick(event) {
    event.preventDefault();
    dispatch({
      type: TOGGLE_FILTERS_COLLAPSE,
      payload: !filtersCollapse,
    });
  }

  async function onCopyWebsitesClick() {
    const dataToCopy = preparedData.map((e) => e['website']).join('\n');
    try {
      await navigator.clipboard.writeText(dataToCopy);
      setCopyWebsitesBtnText('copied');
    } catch (e) {
      console.log(`Error due to copy websites list to clipboard`, e);
    } finally {
      setTimeout(() => setCopyWebsitesBtnText('copy'), 1000);
    }
  }

  return (
    <details open={!filtersCollapse} className="filters">
      <summary onClick={onSummaryClick}>Filters:</summary>
      <div className="filters__content">
        {Object.keys(columns).map((column) => {
          if (column === 'tags' || !columns[column]['renderFilter'])
            return null;
          return (
            <FilterField
              key={column}
              name={column}
              placeholder={fromCamelCaseToWords(column)}
            />
          );
        })}
        {Object.keys(columns).includes('tags') && <TagsFilterField />}
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
