import { useDispatch, useSelector } from 'react-redux';

import { FieldTitle } from './FieldTitle';
import { FILTERS_UPDATED } from '../features/table/table.constants';

export function FilterField({ name, placeholder }) {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state['table']);

  function onChange(event) {
    dispatch({
      type: FILTERS_UPDATED,
      payload: {
        [name]: event.target.value,
      },
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
        placeholder={placeholder}
        value={filters[name]}
      />
    </FieldTitle>
  );
}
