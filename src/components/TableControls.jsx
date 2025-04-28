import { useDispatch, useSelector } from 'react-redux';

import { Checkbox } from './Checkbox';
import { fromCamelCaseToWords, triggerGtmEvent } from '../misc/functions';
import { toggleCustomizationColumnsExpanded } from '../features/app/app.actions';
import { updateShowColumns } from '../features/table/table.actions';
import { gtmEvents } from '../misc/gtm.constants';

export function TableControls() {
  const dispatch = useDispatch();
  const showColumns = useSelector((state) => state['table'].showColumns);
  const customizeColumnsExpanded = useSelector(
    (state) => state['app'].customizeColumnsExpanded,
  );
  const renderableColumns = useSelector(
    (state) => state['table'].renderableColumns,
  );
  const defaultShowColumns = useSelector(
    (state) => state['table'].defaultShowColumns,
  );

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
    dispatch(updateShowColumns(updatedShowColumns));
    triggerGtmEvent(gtmEvents.showedColumnChange, {
      ...eventInfo,
    });
  }

  function onClickHideAllColumns() {
    dispatch(updateShowColumns([]));
    triggerGtmEvent(gtmEvents.btn, {
      method: 'hide-all-columns',
    });
  }

  function onClickShowAllColumns() {
    dispatch(updateShowColumns(renderableColumns));
    triggerGtmEvent(gtmEvents.btn, {
      method: 'show-all-columns',
    });
  }

  function onClickRestoreDefaultColumns() {
    dispatch(updateShowColumns(defaultShowColumns));
    triggerGtmEvent(gtmEvents.btn, {
      method: 'restore-default-columns',
    });
  }

  function onSummaryClick(event) {
    event.preventDefault();
    dispatch(toggleCustomizationColumnsExpanded(!customizeColumnsExpanded));
  }

  return (
    <section className="table-controls">
      <div className="btn-group">
        <button
          className="btn"
          onClick={onClickShowAllColumns}
          data-qa="showAllColumns"
        >
          show all
        </button>
        <button
          className="btn"
          onClick={onClickHideAllColumns}
          data-qa="hideAllColumns"
        >
          hide all
        </button>
        <button
          className="btn"
          onClick={onClickRestoreDefaultColumns}
          data-qa="restoreDefaultColumns"
        >
          restore default
        </button>
      </div>
      <ul className="customize-columns">
        {renderableColumns.map((column) => {
          return (
            <li key={column}>
              <Checkbox
                name={column}
                label={fromCamelCaseToWords(column)}
                checked={showColumns.includes(column)}
                onChange={onChange.bind(this, column)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
