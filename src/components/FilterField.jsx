import { useDispatch, useSelector } from 'react-redux';

import { MobileFieldTitle } from './MobileFieldTitle';
import { FILTERS_UPDATED } from '../features/table/table.constants';

export function FilterField({ name, placeholder }) {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state['table']);

  function onChange(e) {
    dispatch({
      type: FILTERS_UPDATED,
      payload: {
        [name]: e.target.value,
      },
    });
  }

  return (
    <>
      <MobileFieldTitle text={placeholder} />
      <input
        type="text"
        className="input"
        onChange={onChange}
        placeholder={placeholder}
        value={filters[name]}
      />
    </>
  );
}
