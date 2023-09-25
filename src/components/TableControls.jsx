import { useDispatch, useSelector } from 'react-redux';

import { Checkbox } from './Checkbox';
import { SHOWED_COLUMNS_UPDATED } from '../features/table/table.constants';
import { fromCamelCaseToWords } from '../misc/functions';

export function TableControls() {
  const dispatch = useDispatch();
  const { websitesData, showedColumns } = useSelector(
    (state) => state['table']
  );
  const { columns } = websitesData;

  function onChange(column) {
    let newShowedColumns = [...showedColumns];
    if (newShowedColumns.includes(column)) {
      newShowedColumns = newShowedColumns.filter((col) => col !== column);
    } else {
      newShowedColumns.push(column);
    }
    newShowedColumns.sort((a, b) => columns.indexOf(a) - columns.indexOf(b));
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: newShowedColumns,
    });
  }

  function onClickRestoreDefaultColumns() {
    dispatch({
      type: SHOWED_COLUMNS_UPDATED,
      payload: columns,
    });
  }

  return (
    <section className="table-controls">
      <details>
        <summary>Showed columns:</summary>
        <ul className="showed-columns">
          {columns.map((column) => (
            <li key={column} className="showed-columns__item">
              <Checkbox
                label={fromCamelCaseToWords(column)}
                checked={showedColumns.includes(column)}
                onChange={onChange.bind(this, column)}
              />
            </li>
          ))}
        </ul>
        <button className="btn" onClick={onClickRestoreDefaultColumns}>
          restore defaults columns
        </button>
      </details>
    </section>
  );
}
