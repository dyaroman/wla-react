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

export function ToggleButtonsPanel() {
  const dispatch = useDispatch();

  return (
    <>
      <div className="toggle-buttons-panel">
        <button
          onClick={() => dispatch(openDrawer(FILTERS))}
          className="toggle-buttons-panel__btn"
          aria-label="filters"
          data-qa="filters"
        >
          <Icons name="filters" />
        </button>

        <button
          onClick={() => dispatch(openDrawer(TAGS))}
          className="toggle-buttons-panel__btn"
          aria-label="tags"
          data-qa="tags"
        >
          <Icons name="tags" />
        </button>

        <button
          onClick={() => dispatch(openDrawer(CUSTOMIZE_COLUMNS))}
          className="toggle-buttons-panel__btn"
          aria-label="customize columns"
          data-qa="customizeColumns"
        >
          <Icons name="columns" />
        </button>

        <Burger />
      </div>

      <Drawer
        drawerId={FILTERS}
        title="Filters"
        position="left"
        maxSize="320px"
      >
        <Filters />
      </Drawer>

      <Drawer drawerId={TAGS} title="Tags" position="right" maxSize="320px">
        <Tags />
      </Drawer>

      <Drawer
        drawerId={CUSTOMIZE_COLUMNS}
        title="Customize columns"
        position="right"
        maxSize="320px"
      >
        <TableControls />
      </Drawer>

      <Drawer
        drawerId={SIDEBAR}
        position="left"
        maxSize="300px"
        title="Sidebar"
      >
        <TableInfo />
        <ResultsControls />
      </Drawer>
    </>
  );
}
