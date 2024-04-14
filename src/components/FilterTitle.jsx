import { useDispatch, useSelector } from 'react-redux';

import { triggerGtmEvent } from '../misc/functions';
import { SORT_UPDATED } from '../features/table/table.constants';
import { TABLE_SORT } from '../misc/gtm.constants';

export function FilterTitle({ column, text }) {
  const dispatch = useDispatch();
  const sort = useSelector((state) => state['table'].sort);
  let direction = null;
  if (sort.column === column && sort.direction !== '') {
    direction = sort.direction;
  }

  function onClick(event) {
    const sortColumn = event.target.dataset.sortColumn;
    const sortDirection = event.target.dataset.sortDirection;
    const newSort = {};
    const eventInfo = {
      label: sortColumn,
    };
    if (sortColumn !== sort.column) {
      newSort['column'] = sortColumn;
    }
    if (sortDirection === undefined || sortDirection === 'desc') {
      newSort['direction'] = 'asc';
      eventInfo.method = 'asc';
    } else {
      newSort['direction'] = 'desc';
      eventInfo.method = 'desc';
    }
    dispatch({
      type: SORT_UPDATED,
      payload: newSort,
    });
    triggerGtmEvent(TABLE_SORT, {
      ...eventInfo,
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
