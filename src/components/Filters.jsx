import { useDispatch, useSelector } from 'react-redux';

import { FilterField } from './FilterField';
import { fromCamelCaseToWords, triggerGtmEvent } from '../misc/functions';
import { useKeyPress } from '../hooks/useKeyPress';
import {
  toggleFiltersOpen,
  toggleSidebarOpen,
} from '../features/app/app.actions';
import { SHORTCUT_GTM_EVENT } from '../misc/gtm.constants';
import { COLUMNS } from '../misc/columns.constants';

export function Filters() {
  const dispatch = useDispatch();
  const filtersOpen = useSelector((state) => state['app'].filtersOpen);
  const sidebarOpen = useSelector((state) => state['app'].sidebarOpen);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const columns = websitesData['columns'];

  // search
  useKeyPress(['CommandOrControl', 'Shift', 'F'], (event) => {
    event.preventDefault();
    onSearchShortcut();
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
      method: 'search',
      label: event.ctrlKey ? 'windows' : 'macos',
    });
  });

  if (websitesData['websites'].length === 0) {
    return null;
  }

  function onSearchShortcut() {
    if (!sidebarOpen) {
      dispatch(toggleSidebarOpen(true));
    }
    if (!filtersOpen) {
      dispatch(toggleFiltersOpen(true));
    }
    setTimeout(() => {
      document.querySelector('input').select();
    });
  }

  function onSummaryClick(event) {
    event.preventDefault();
    dispatch(toggleFiltersOpen(!filtersOpen));
  }

  return (
    <details open={filtersOpen} className="filters  mt">
      <summary onClick={onSummaryClick}>Filters:</summary>
      <div className="filters__content">
        {Object.keys(columns).map((column) => {
          if (column === COLUMNS.tags || !columns[column]['renderFilter'])
            return null;
          return (
            <FilterField
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
