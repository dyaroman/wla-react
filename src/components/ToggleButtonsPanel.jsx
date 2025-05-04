import { useDispatch } from 'react-redux';

import { Drawer } from './Drawer';
import { Filters } from './Filters';
import { Tags } from './Tags';
import { TableControls } from './TableControls';
import { openDrawer } from '../features/drawer/drawer.actions';
import {
  CUSTOMIZE_COLUMNS,
  FILTERS,
  TAGS,
} from '../features/drawer/drawer.constants';

// todo: move this component header, show icons on mobile and text on desktop
export function ToggleButtonsPanel() {
  const dispatch = useDispatch();

  return (
    <>
      <div className="toggle-buttons-panel">
        <button
          onClick={() => dispatch(openDrawer(FILTERS))}
          className="btn"
          data-qa="filters"
        >
          filters
        </button>

        <button
          onClick={() => dispatch(openDrawer(TAGS))}
          className="btn"
          data-qa="tags"
        >
          tags
        </button>

        <button
          onClick={() => dispatch(openDrawer(CUSTOMIZE_COLUMNS))}
          className="btn"
          data-qa="customizeColumns"
        >
          customize columns
        </button>
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
    </>
  );
}
