import { useDispatch, useSelector } from 'react-redux';

import { triggerGtmEvent } from '../misc/functions';
import { updateShowColumns } from '../features/table/table.actions';
import { FILTERS_UPDATED } from '../features/table/table.constants';
import { FILTER_CHANGE } from '../misc/gtm.constants';

export function Filter({ name, placeholder }) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state['table'].filters);
  const showColumns = useSelector((state) => state['table'].showColumns);

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
    triggerGtmEvent(FILTER_CHANGE, {
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
        data-qa={name}
        className={'input' + (filters[name].length ? ' input--filled' : '')}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        value={filters[name]}
      />
    </label>
  );
}
