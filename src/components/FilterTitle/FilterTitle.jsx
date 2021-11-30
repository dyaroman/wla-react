import { useDispatch, useSelector } from "react-redux";

import { SORT_UPDATED } from "../../features/table/table.constants";

export function FilterTitle({ columnName, text }) {
  const dispatch = useDispatch();
  const { sort } = useSelector((state) => state["table"]);
  let sortDirection = null;
  if (sort.sortColumn === columnName && sort.sortDirection !== "") {
    sortDirection = sort.sortDirection;
  }

  function onClick(e) {
    const { sortColName, sortColDirection } = e.target.dataset;
    const newSort = {};
    if (sortColName !== sort.sortColumn) {
      newSort["sortColumn"] = sortColName;
    }
    if (sortColDirection === undefined || sortColDirection === "desc") {
      newSort["sortDirection"] = "asc";
    } else {
      newSort["sortDirection"] = "desc";
    }
    dispatch({
      type: SORT_UPDATED,
      payload: newSort,
    });
  }

  return (
    <th
      data-sort-col-name={columnName ? columnName : null}
      data-sort-col-direction={sortDirection}
      onClick={onClick}
    >
      {text}
    </th>
  );
}
