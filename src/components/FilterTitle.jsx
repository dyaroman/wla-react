import { useDispatch, useSelector } from 'react-redux';

import { SORT_UPDATED } from '../features/table/table.constants';

export function FilterTitle({ columnName, text }) {
  const dispatch = useDispatch();
  const { sort } = useSelector((state) => state['table']);
  let direction = null;
  if (sort.column === columnName && sort.direction !== '') {
    direction = sort.direction;
  }

  function onClick(e) {
    const { sortColName, sortColDirection } = e.target.dataset;
    const newSort = {};
    if (sortColName !== sort.column) {
      newSort['column'] = sortColName;
    }
    if (sortColDirection === undefined || sortColDirection === 'desc') {
      newSort['direction'] = 'asc';
    } else {
      newSort['direction'] = 'desc';
    }
    dispatch({
      type: SORT_UPDATED,
      payload: newSort,
    });
  }

  return (
    <th
      data-sort-col-name={columnName ? columnName : null}
      data-sort-col-direction={direction}
      data-qa={columnName}
      onClick={onClick}
    >
      {text}
    </th>
  );
}
