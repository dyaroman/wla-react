import { useDispatch, useSelector } from 'react-redux';

import {
  fromCamelCaseToWords,
  getUniqueValues,
  triggerGtmEvent,
} from '../misc/functions';
import { updateShowColumns } from '../features/table/table.actions';
import { gtmEvents } from '../misc/gtm.constants';
import { FILTERS_UPDATED } from '../features/table/table.constants';

export function Filter({ name, placeholder }) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state['table'].filters);
  const showColumns = useSelector((state) => state['table'].showColumns);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const autocompleteList = getUniqueValues(preparedData, name).sort();
  const autocompleteListName = `${fromCamelCaseToWords(name ?? '')
    .split(' ')
    .join('-')
    .toLowerCase()}-autocomplete-list`;

  function onChange(event) {
    if (!showColumns.includes(name)) {
      dispatch(updateShowColumns([...showColumns, name]));
    }

    dispatch({
      type: FILTERS_UPDATED,
      payload: {
        [name]: event.target.value,
      },
    });
  }

  function onBlur(event) {
    triggerGtmEvent(gtmEvents.filterChange, {
      filter_name: name,
      filter_value: event.target.value,
    });
  }

  return (
    <label className="filter-title">
      <span className="filter-title__text">{placeholder}</span>
      <input
        type="text"
        name={name}
        list={autocompleteListName}
        data-qa={name}
        className={'input' + (filters[name].length ? ' input--filled' : '')}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        value={filters[name]}
      />
      {autocompleteList.length > 0 &&
        !autocompleteList.find(
          (i) => filters[name].toLowerCase() === String(i).toLowerCase(),
        ) && (
          <datalist id={autocompleteListName}>
            {autocompleteList.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        )}
    </label>
  );
}
