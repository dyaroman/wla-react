import { useDispatch } from 'react-redux';

import { FilterField } from './FilterField';
import { TagsFilterField } from './TagsFilterField';
import { CLEAR_FILTERS } from '../features/table/table.constants';

export function Filters() {
  const dispatch = useDispatch();

  function onClick() {
    dispatch({
      type: CLEAR_FILTERS,
    });
  }

  return (
    <section className={'filters'}>
      <h4>Filters:</h4>
      <div className="filters__content">
        <FilterField name={'website'} placeholder={'website'} />
        <FilterField name={'template'} placeholder={'template'} />
        <FilterField name={'campaignId'} placeholder={'campaign id'} />
        <FilterField name={'mainForm'} placeholder={'main form'} />
        <FilterField name={'altForm'} placeholder={'alt form'} />
        <FilterField name={'owner'} placeholder={'owner'} />
        <FilterField name={'gtmKey'} placeholder={'gtm key'} />
        <FilterField name={'companyName'} placeholder={'company name'} />
        <FilterField name={'email'} placeholder={'email'} />
        <FilterField name={'address1'} placeholder={'address 1'} />
        <FilterField name={'address2'} placeholder={'address 2'} />
        <TagsFilterField />
      </div>
      <button className="btn" onClick={onClick}>
        clear all
      </button>
    </section>
  );
}
