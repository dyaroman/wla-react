import { useDispatch, useSelector } from 'react-redux';

import { Filter } from './Filter';
import { fromCamelCaseToWords, triggerGtmEvent } from '../misc/functions';
import { useShortcut } from '../hooks/useShortcut';
import { toggleFiltersExpanded } from '../features/app/app.actions';
import { gtmEvents } from '../misc/gtm.constants';
import { COLUMNS } from '../misc/columns.constants';
import { resetFilters } from '../features/table/table.actions';

export function Filters() {
  const dispatch = useDispatch();
  const filtersExpanded = useSelector((state) => state['app'].filtersExpanded);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const columns = websitesData['columns'];

  // todo: check all useShortcut, should works
  // search
  useShortcut(['CommandOrControl', 'Shift', 'F'], (event) => {
    event.preventDefault();
    onSearchShortcut();
    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'search',
      label: event.ctrlKey ? 'windows' : 'macos',
    });
  });

  if (websitesData['websites'].length === 0) {
    return null;
  }

  function onSearchShortcut() {
    if (!filtersExpanded) {
      dispatch(toggleFiltersExpanded(true));
    }
    setTimeout(() => {
      document.querySelector('input').select();
    });
  }

  function onResetFilters() {
    dispatch(resetFilters());
  }

  return (
    <div className="filters">
      <div className="filters__content">
        <button className="btn  btn--danger" onClick={onResetFilters}>
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
