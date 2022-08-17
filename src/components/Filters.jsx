import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterField } from './FilterField';
import { TagsFilterField } from './TagsFilterField';
import { CLEAR_FILTERS } from '../features/table/table.constants';
import { fromCamelCaseToWords } from '../misc/functions';

export function Filters() {
  const dispatch = useDispatch();
  const { preparedData, websitesData } = useSelector((state) => state['table']);
  const { columns } = websitesData;
  const [copyWebsitesBtnText, setCopyWebsitesBtnText] = useState('copy');

  if (websitesData['websites'].length === 0) {
    return null;
  }

  function onClearClick() {
    dispatch({
      type: CLEAR_FILTERS,
    });
  }

  async function onCopyWebsitesClick() {
    const dataToCopy = preparedData.map((e) => e.website).join('\n');
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
    <section className="filters">
      <h4>Filters:</h4>
      <div className="filters__content">
        {columns
          .filter((e) => e !== 'tags')
          .map((column) => (
            <FilterField
              key={column}
              name={column}
              placeholder={fromCamelCaseToWords(column)}
            />
          ))}
        <TagsFilterField />
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
    </section>
  );
}
