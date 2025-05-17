import { useDispatch, useSelector } from 'react-redux';

import { fromCamelCaseToWords, triggerGtmEvent } from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';
import { ASC, DESC, SORT_UPDATED } from '../features/table/table.constants';
import { URL_PARAMETERS } from '../misc/url.constants';

export function ColumnTitle({ column, text = '' }) {
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
      newSort[URL_PARAMETERS.column] = sortColumn;
    }
    if (sortDirection === undefined || sortDirection === DESC) {
      newSort[URL_PARAMETERS.direction] = ASC;
      eventInfo.method = ASC;
    } else {
      newSort[URL_PARAMETERS.direction] = DESC;
      eventInfo.method = DESC;
    }
    dispatch({
      type: SORT_UPDATED,
      payload: newSort,
    });
    triggerGtmEvent(gtmEvents.tableSort, {
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
      {fromCamelCaseToWords(text)}
    </th>
  );
}
