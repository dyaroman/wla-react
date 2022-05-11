import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterField } from './FilterField';
import { TagsFilterField } from './TagsFilterField';
import { CLEAR_FILTERS } from '../features/table/table.constants';

export function Filters() {
  const dispatch = useDispatch();
  const { preparedData } = useSelector((state) => state['table']);
  const [copyWebsitesBtnText, setCopyWebsitesBtnText] = useState('copy');

  function onClearClick() {
    dispatch({
      type: CLEAR_FILTERS,
    });
  }

  async function onCopyWebsitesClick() {
    const dataToCopy = preparedData.map((e) => e.folderName).join('\n');
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
        <FilterField name={'website'} placeholder={'website'} />
        <FilterField name={'template'} placeholder={'template'} />
        <FilterField name={'campaignId'} placeholder={'campaign id'} />
        <FilterField name={'mainForm'} placeholder={'main form'} />
        <FilterField name={'altForm'} placeholder={'alt form'} />
        <FilterField name={'owner'} placeholder={'owner'} />
        <FilterField name={'gtmKey'} placeholder={'gtm key'} />
        <FilterField name={'recaptchaKey'} placeholder={'recaptcha key'} />
        <FilterField name={'companyName'} placeholder={'company name'} />
        <FilterField name={'email'} placeholder={'email'} />
        <FilterField name={'emailLegal'} placeholder={'email legal'} />
        <FilterField name={'address1'} placeholder={'address 1'} />
        <FilterField name={'address2'} placeholder={'address 2'} />
        <TagsFilterField />
      </div>
      <div className="btn-group">
        <button className="btn btn--danger" onClick={onClearClick}>
          clear all
        </button>
      </div>
      <div className="btn-group">
        <button className="btn" onClick={onCopyWebsitesClick}>
          {copyWebsitesBtnText} websites
        </button>
      </div>
    </section>
  );
}
