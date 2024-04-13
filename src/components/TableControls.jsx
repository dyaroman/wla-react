import { useDispatch, useSelector } from 'react-redux';

import { Checkbox } from './Checkbox';
import { SHOWED_COLUMNS_UPDATED } from '../features/table/table.constants';
import { fromCamelCaseToWords, triggerGtmEvent } from '../misc/functions';
import {
  HIDE_ALL_COLUMNS_BTN,
  RESTORE_DEFAULT_COLUMNS_BTN,
  SHOW_ALL_COLUMNS_BTN,
  SHOWED_COLUMN_CHANGE,
} from '../misc/gtm.constants';

export function TableControls() {
  const dispatch = useDispatch();
  const showColumns = useSelector((state) => state['table'].showColumns);
  const renderableColumns = useSelector(
    (state) => state['table'].renderableColumns,
  );
  const defaultShowColumns = useSelector(
    (state) => state['table'].defaultShowColumns,
  );
  const websitesData = useSelector((state) => state['table'].websitesData);
  const { columns } = websitesData;

  function onChange(column) {
    let updatedShowColumns = [...showColumns];
    const eventInfo = {
      label: column,
    };
    if (updatedShowColumns.includes(column)) {
      updatedShowColumns = updatedShowColumns.filter((col) => col !== column);
      eventInfo.method = 'off';
    } else {
      updatedShowColumns.push(column);
      eventInfo.method = 'on';
    }
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: updatedShowColumns,
    });
    triggerGtmEvent(SHOWED_COLUMN_CHANGE, {
      ...eventInfo,
    });
  }

  function onClickHideAllColumns() {
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: [],
    });
    triggerGtmEvent(HIDE_ALL_COLUMNS_BTN);
  }

  function onClickShowAllColumns() {
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: renderableColumns,
    });
    triggerGtmEvent(SHOW_ALL_COLUMNS_BTN);
  }

  function onClickRestoreDefaultColumns() {
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: defaultShowColumns,
    });
    triggerGtmEvent(RESTORE_DEFAULT_COLUMNS_BTN);
  }

  return (
    <section className="table-controls">
      <details>
        <summary>Customize columns:</summary>
        <ul className="customize-columns">
          {renderableColumns.map((column) => {
            return (
              <li key={column}>
                <Checkbox
                  label={fromCamelCaseToWords(column)}
                  checked={showColumns.includes(column)}
                  onChange={onChange.bind(this, column)}
                />
              </li>
            );
          })}
        </ul>
        <div className="btn-group">
          <button
            className="btn"
            onClick={onClickShowAllColumns}
            data-qa="showAllColumns"
          >
            show all columns
          </button>
          <button
            className="btn"
            onClick={onClickHideAllColumns}
            data-qa="hideAllColumns"
          >
            hide all columns
          </button>
          <button
            className="btn"
            onClick={onClickRestoreDefaultColumns}
            data-qa="restoreDefaultColumns"
          >
            restore default columns
          </button>
        </div>
      </details>
    </section>
  );
}
