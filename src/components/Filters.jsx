import { useDispatch, useSelector } from 'react-redux';

import { Filter } from './Filter';
import { fromCamelCaseToWords, triggerGtmEvent } from '../misc/functions';
import { useShortcut } from '../hooks/useShortcut';
import { toggleFiltersExpanded } from '../features/app/app.actions';
import { gtmEvents } from '../misc/gtm.constants';
import { COLUMNS } from '../misc/columns.constants';
import { TOGGLE_SIDEBAR_OPENED } from '../features/app/app.constants';
import { resetFilters } from '../features/table/table.actions';

export function Filters() {
  const dispatch = useDispatch();
  const filtersExpanded = useSelector((state) => state['app'].filtersExpanded);
  const sidebarOpened = useSelector((state) => state['app'].sidebarOpened);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const columns = websitesData['columns'];

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
    if (!sidebarOpened) {
      dispatch({
        type: TOGGLE_SIDEBAR_OPENED,
        payload: true,
      });
    }
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
