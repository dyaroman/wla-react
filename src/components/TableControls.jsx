import { useDispatch, useSelector } from 'react-redux';

import { Checkbox } from './Checkbox';
import { SHOWED_COLUMNS_UPDATED } from '../features/table/table.constants';
import { fromCamelCaseToWords } from '../misc/functions';

export function TableControls() {
  const dispatch = useDispatch();
  const {
    websitesData: { columns },
    showedColumns,
  } = useSelector((state) => state['table']);

  function onChange(column) {
    let updatedShowedColumns = [...showedColumns];
    if (updatedShowedColumns.includes(column)) {
      updatedShowedColumns = updatedShowedColumns.filter(
        (col) => col !== column,
      );
    } else {
      updatedShowedColumns.push(column);
    }
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: updatedShowedColumns,
    });
  }

  function onClickHideAllColumns() {
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: [],
    });
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
  }

  function onClickRestoreDefaultColumns() {
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: Object.keys(columns).filter(
        (column) => columns[column]['showColumn'],
      ),
    });
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
