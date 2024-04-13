import { useDispatch, useSelector } from 'react-redux';

import { FieldTitle } from './FieldTitle';
import { triggerGtmEvent } from '../misc/functions';
import {
  FILTERS_UPDATED,
  SHOWED_COLUMNS_UPDATED,
} from '../features/table/table.constants';
import { FILTER_CHANGE } from '../misc/gtm.constants';

export function FilterField({ name, placeholder }) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state['table'].filters);
  const showColumns = useSelector((state) => state['table'].showColumns);

  function onChange(event) {
    if (!showColumns.includes(name)) {
      dispatch({
        type: SHOWED_COLUMNS_UPDATED,
        payload: [...showColumns, name],
      });
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
    <FieldTitle text={placeholder}>
      <input
        type="text"
        name={name}
        data-qa={name}
        className="input"
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        value={filters[name]}
      />
    </FieldTitle>
  );
}
