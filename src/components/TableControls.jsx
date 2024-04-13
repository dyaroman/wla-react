import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { Checkbox } from './Checkbox';
import { SHOWED_COLUMNS_UPDATED } from '../features/table/table.constants';
import {
  fromCamelCaseToWords,
  getQueryParamValue,
  triggerGtmEvent,
} from '../misc/functions';
import {
  HIDE_ALL_COLUMNS_BTN,
  RESTORE_DEFAULT_COLUMNS_BTN,
  SHOW_ALL_COLUMNS_BTN,
  SHOWED_COLUMN_CHANGE,
} from '../misc/gtm.constants';
import { TOGGLE_CUSTOMIZE_COLUMNS_OPEN } from '../features/app/app.constants';
import { CUSTOMIZE_COLUMNS_OPEN } from '../misc/url.constants';

export function TableControls() {
  const dispatch = useDispatch();
  const showColumns = useSelector((state) => state['table'].showColumns);
  const customizeColumnsOpen = useSelector(
    (state) => state['app'].customizeColumnsOpen,
  );
  const renderableColumns = useSelector(
    (state) => state['table'].renderableColumns,
  );
  const defaultShowColumns = useSelector(
    (state) => state['table'].defaultShowColumns,
  );

  useEffect(() => {
    if (getQueryParamValue(CUSTOMIZE_COLUMNS_OPEN) === '') {
      dispatch({
        type: TOGGLE_CUSTOMIZE_COLUMNS_OPEN,
        payload: true,
      });
    }
  }, []);

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

  function onSummaryClick(event) {
    event.preventDefault();
    dispatch({
      type: TOGGLE_CUSTOMIZE_COLUMNS_OPEN,
      payload: !customizeColumnsOpen,
    });
  }

  return (
    <section className="table-controls">
      <details open={customizeColumnsOpen}>
        <summary onClick={onSummaryClick}>Customize columns:</summary>
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
