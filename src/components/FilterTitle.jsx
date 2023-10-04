import { useDispatch, useSelector } from 'react-redux';

import { SORT_UPDATED } from '../features/table/table.constants';

export function FilterTitle({ column, text }) {
  const dispatch = useDispatch();
  const { sort } = useSelector((state) => state['table']);
  let direction = null;
  if (sort.column === column && sort.direction !== '') {
    direction = sort.direction;
  }

  function onClick(event) {
    const { sortColumn, sortDirection } = event.target.dataset;
    const newSort = {};
    if (sortColumn !== sort.column) {
      newSort['column'] = sortColumn;
    }
    if (sortDirection === undefined || sortDirection === 'desc') {
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
      data-sort-column={column}
      data-sort-direction={direction}
      data-qa={column}
      onClick={onClick}
    >
      {text}
    </th>
  );
}
