import { useDispatch } from 'react-redux';

import { Drawer } from './Drawer';
import { Filters } from './Filters';
import { Tags } from './Tags';
import { TableControls } from './TableControls';
import { Icons } from './Icons';
import { Burger } from './Burger';
import { TableInfo } from './TableInfo';
import { ResultsControls } from './ResultsControls';
import { openDrawer } from '../features/drawer/drawer.actions';
import {
  CUSTOMIZE_COLUMNS,
  FILTERS,
  SIDEBAR,
  TAGS,
} from '../features/drawer/drawer.constants';

export function ToggleButtonsPanel({ position }) {
  const dispatch = useDispatch();

  if (!position) return null;

  return (
    <>
      <div className="flex-row">
        {position === 'left' && (
          <>
            <Burger />
            <Drawer
              drawerId={SIDEBAR}
              position="left"
              maxSize="320px"
              title="Sidebar"
            >
              <TableInfo />
              <ResultsControls />
            </Drawer>

            <button
              onClick={() => dispatch(openDrawer(FILTERS))}
              className="btn-with-icon"
              aria-label="filters"
              data-qa="filters"
            >
              <Icons name="filters" />
            </button>
            <Drawer
              drawerId={FILTERS}
              title="Filters"
              position="left"
              maxSize="320px"
            >
              <Filters />
            </Drawer>
          </>
        )}

        {position === 'right' && (
          <>
            <button
              onClick={() => dispatch(openDrawer(TAGS))}
              className="btn-with-icon"
              aria-label="tags"
              data-qa="tags"
            >
              <Icons name="tags" />
            </button>
            <Drawer
              drawerId={TAGS}
              title="Tags"
              position="right"
              maxSize="320px"
            >
              <Tags />
            </Drawer>

            <button
              onClick={() => dispatch(openDrawer(CUSTOMIZE_COLUMNS))}
              className="btn-with-icon"
              aria-label="customize columns"
              data-qa="customizeColumns"
            >
              <Icons name="columns" />
            </button>
            <Drawer
              drawerId={CUSTOMIZE_COLUMNS}
              title="Customize columns"
              position="right"
              maxSize="320px"
            >
              <TableControls />
            </Drawer>
          </>
        )}
      </div>
    </>
  );
}
