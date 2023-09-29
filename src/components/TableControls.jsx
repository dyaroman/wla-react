import { useDispatch, useSelector } from 'react-redux';

import { Checkbox } from './Checkbox';
import { SHOWED_COLUMNS_UPDATED } from '../features/table/table.constants';
import { fromCamelCaseToWords } from '../misc/functions';

export function TableControls() {
  const dispatch = useDispatch();
  const { websitesData, showedColumns, hiddenColumns } = useSelector(
    (state) => state['table']
  );
  const {
    columns: showedColumnsOriginal,
    hiddenColumns: hiddenColumnsOriginal,
  } = websitesData;

  function onChange(column) {
    const columnsOrderOrigin = [
      ...showedColumnsOriginal,
      ...hiddenColumnsOriginal,
    ];
    let updatedShowedColumns = [...showedColumns];
    if (updatedShowedColumns.includes(column)) {
      updatedShowedColumns = updatedShowedColumns.filter(
        (col) => col !== column
      );
    } else {
      updatedShowedColumns.push(column);
    }
    updatedShowedColumns.sort(
      (a, b) => columnsOrderOrigin.indexOf(a) - columnsOrderOrigin.indexOf(b)
    );
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

  function onClickRestoreDefaultColumns() {
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: showedColumnsOriginal,
    });
  }

  return (
    <section className="table-controls">
      <details>
        <summary>Showed columns:</summary>
        <ul className="showed-columns">
          {[...showedColumnsOriginal, ...hiddenColumns].map((column) => (
            <li key={column} className="showed-columns__item">
              <Checkbox
                label={fromCamelCaseToWords(column)}
                checked={showedColumns.includes(column)}
                onChange={onChange.bind(this, column)}
              />
            </li>
          ))}
        </ul>
        <div className="btn-group">
          <button className="btn" onClick={onClickHideAllColumns}>
            hide all columns
          </button>
          <button className="btn" onClick={onClickRestoreDefaultColumns}>
            restore defaults columns
          </button>
        </div>
      </details>
    </section>
  );
}
