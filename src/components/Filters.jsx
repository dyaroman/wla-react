import { useDispatch, useSelector } from 'react-redux';

import { Filter } from './Filter';
import { fromCamelCaseToWords, triggerGtmEvent } from '../misc/functions';
import { useShortcut } from '../hooks/useShortcut';
import {
  toggleFiltersExpanded,
  toggleSidebarOpened,
} from '../features/app/app.actions';
import { gtmEvents } from '../misc/gtm.constants';
import { COLUMNS } from '../misc/columns.constants';

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
      dispatch(toggleSidebarOpened(true));
    }
    if (!filtersExpanded) {
      dispatch(toggleFiltersExpanded(true));
    }
    setTimeout(() => {
      document.querySelector('input').select();
    });
  }

  function onSummaryClick(event) {
    event.preventDefault();
    dispatch(toggleFiltersExpanded(!filtersExpanded));
  }

  return (
    <details open={filtersExpanded} className="filters  mt">
      <summary onClick={onSummaryClick}>Filters:</summary>
      <div className="filters__content">
        {Object.keys(columns).map((column) => {
          if (column === COLUMNS.tags || !columns[column]['renderFilter'])
            return null;
          return (
            <Filter
              key={column}
              name={column}
              placeholder={fromCamelCaseToWords(column)}
            />
          );
        })}
      </div>
    </details>
  );
}
