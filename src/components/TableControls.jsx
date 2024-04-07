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
  const showedColumns = useSelector((state) => state['table'].showedColumns);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const { columns } = websitesData;

  function onChange(column) {
    let updatedShowedColumns = [...showedColumns];
    const eventInfo = {
      label: column,
    };
    if (updatedShowedColumns.includes(column)) {
      updatedShowedColumns = updatedShowedColumns.filter(
        (col) => col !== column,
      );
      eventInfo.method = 'off';
    } else {
      updatedShowedColumns.push(column);
      eventInfo.method = 'on';
    }
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: updatedShowedColumns,
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
      payload: [
        ...Object.keys(columns).filter(
          (column) => columns[column]['renderColumn'],
        ),
      ],
    });
    triggerGtmEvent(SHOW_ALL_COLUMNS_BTN);
  }

  function onClickRestoreDefaultColumns() {
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: Object.keys(columns).filter(
        (column) => columns[column]['showColumn'],
      ),
    });
    triggerGtmEvent(RESTORE_DEFAULT_COLUMNS_BTN);
  }

  return (
    <section className="table-controls">
      <details>
        <summary>Showed columns:</summary>
        <ul className="showed-columns">
          {Object.keys(columns).map((column) => {
            if (!columns[column]['renderColumn']) return null;
            return (
              <li key={column} className="showed-columns__item">
                <Checkbox
                  label={fromCamelCaseToWords(column)}
                  checked={showedColumns.includes(column)}
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
