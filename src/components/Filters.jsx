import { useDispatch, useSelector } from 'react-redux';

import { Filter } from './Filter';
import { fromCamelCaseToWords } from '../misc/functions';
import { COLUMNS } from '../misc/columns.constants';
import { resetFilters } from '../features/table/table.actions';

export function Filters() {
  const dispatch = useDispatch();
  const websitesData = useSelector((state) => state['table'].websitesData);
  const columns = websitesData['columns'];

  if (websitesData['websites'].length === 0) {
    return null;
  }

  function onResetFilters() {
    dispatch(resetFilters());
  }

  return (
    <div className="filters">
      <div className="filters__content">
        <button
          className="btn  btn--danger"
          onClick={onResetFilters}
          data-qa="resetFilters"
        >
          reset filters
        </button>

        {Object.keys(columns).map((column) => {
          if (!columns[column]['renderFilter'] || column === COLUMNS.tags) {
            return null;
          }

          return (
            <Filter
              key={column}
              name={column}
              placeholder={fromCamelCaseToWords(column)}
            />
          );
        })}
      </div>
    </div>
  );
}
