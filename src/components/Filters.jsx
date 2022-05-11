import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterField } from './FilterField';
import { TagsFilterField } from './TagsFilterField';
import { CLEAR_FILTERS } from '../features/table/table.constants';

export function Filters() {
  const dispatch = useDispatch();
  const { preparedData, websiteDataStructure } = useSelector(
    (state) => state['table']
  );
  const [copyWebsitesBtnText, setCopyWebsitesBtnText] = useState('copy');

  const campaignIdColumn = websiteDataStructure.includes('campaignId');
  const altFormColumn = websiteDataStructure.includes('ALT_FORM');
  const ownerColumn = websiteDataStructure.includes('owner');
  const gtmKeyColumn = websiteDataStructure.includes('gtmKey');
  const recaptchaKeyColumn = websiteDataStructure.includes('recaptchaKey');
  const address1Column = websiteDataStructure.includes('address1');
  const address2Column = websiteDataStructure.includes('address2');
  const emailLegalColumn = websiteDataStructure.includes('emailLegal');
  const effectiveDateColumn = websiteDataStructure.includes('effectiveDate');

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
        {campaignIdColumn && (
          <FilterField name={'campaignId'} placeholder={'campaign id'} />
        )}
        <FilterField name={'mainForm'} placeholder={'main form'} />
        {altFormColumn && (
          <FilterField name={'altForm'} placeholder={'alt form'} />
        )}
        {ownerColumn && <FilterField name={'owner'} placeholder={'owner'} />}
        {gtmKeyColumn && (
          <FilterField name={'gtmKey'} placeholder={'gtm key'} />
        )}
        {recaptchaKeyColumn && (
          <FilterField name={'recaptchaKey'} placeholder={'recaptcha key'} />
        )}
        <FilterField name={'companyName'} placeholder={'company name'} />
        <FilterField name={'email'} placeholder={'email'} />
        {emailLegalColumn && (
          <FilterField name={'emailLegal'} placeholder={'email legal'} />
        )}
        {effectiveDateColumn && (
          <FilterField name={'effectiveDate'} placeholder={'effective date'} />
        )}
        {address1Column && (
          <FilterField name={'address1'} placeholder={'address 1'} />
        )}
        {address2Column && (
          <FilterField name={'address2'} placeholder={'address 2'} />
        )}
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
