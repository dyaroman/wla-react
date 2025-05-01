import { useDispatch, useSelector } from 'react-redux';

import { Drawer } from './Drawer';
import { Filters } from './Filters';
import { Tags } from './Tags';
import { TableControls } from './TableControls';
import {
  TOGGLE_CUSTOMIZATION_COLUMNS_OPENED,
  TOGGLE_FILTERS_OPENED,
  TOGGLE_TAGS_OPENED,
} from '../features/app/app.constants';

export function ToggleButtonsPanel() {
  const dispatch = useDispatch();
  const customizationColumnsOpened = useSelector(
    (state) => state['app'].customizationColumnsOpened,
  );
  const filtersOpened = useSelector((state) => state['app'].filtersOpened);
  const tagsOpened = useSelector((state) => state['app'].tagsOpened);

  return (
    <>
      <div className="toggle-buttons-panel">
        <button
          onClick={() =>
            dispatch({
              type: TOGGLE_FILTERS_OPENED,
              payload: true,
            })
          }
          className="btn"
        >
          filters
        </button>

        <button
          onClick={() =>
            dispatch({
              type: TOGGLE_TAGS_OPENED,
              payload: true,
            })
          }
          className="btn"
        >
          tags
        </button>

        <button
          onClick={() =>
            dispatch({
              type: TOGGLE_CUSTOMIZATION_COLUMNS_OPENED,
              payload: true,
            })
          }
          className="btn"
        >
          customize columns
        </button>
      </div>

      <Drawer
        isOpen={filtersOpened}
        onClose={() =>
          dispatch({
            type: TOGGLE_FILTERS_OPENED,
            payload: false,
          })
        }
        title="Filters"
        position="left"
        maxSize="320px"
      >
        <Filters />
      </Drawer>

      <Drawer
        isOpen={tagsOpened}
        onClose={() =>
          dispatch({
            type: TOGGLE_TAGS_OPENED,
            payload: false,
          })
        }
        title="Tags"
        position="right"
        maxSize="320px"
      >
        <Tags />
      </Drawer>

      <Drawer
        isOpen={customizationColumnsOpened}
        onClose={() =>
          dispatch({
            type: TOGGLE_CUSTOMIZATION_COLUMNS_OPENED,
            payload: false,
          })
        }
        title="Customize columns"
        position="right"
        maxSize="320px"
      >
        <TableControls />
      </Drawer>
    </>
  );
}
