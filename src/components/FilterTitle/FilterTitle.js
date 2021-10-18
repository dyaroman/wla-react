function FilterTitle({columnName, onClickHandler, sort, text}) {
  let sortDirection = null;
  if (
    sort &&
    sort.sortColumn === columnName &&
    sort.sortDirection !== ''
  ) {
    sortDirection = sort.sortDirection;
  }
  return <th
    data-sort-col-name={columnName ? columnName : null}
    data-sort-col-direction={sortDirection}
    onClick={onClickHandler ? onClickHandler : null}
  >{text}
  </th>
}

export default FilterTitle;
