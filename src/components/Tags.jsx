import { useDispatch, useSelector } from 'react-redux';

import { Checkbox } from './Checkbox';
import { FILTERS_UPDATED } from '../features/table/table.constants';

export function Tags({ items }) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state['table'].filters);

  function onChange(tag) {
    let updatedTags = [...filters.tags];
    if (updatedTags.includes(tag)) {
      updatedTags = updatedTags.filter((item) => item !== tag);
    } else {
      updatedTags.push(tag);
    }
    dispatch({
      type: FILTERS_UPDATED,
      payload: {
        tags: updatedTags,
      },
    });
  }

  if (items.length === 0) {
    return null;
  }

  const list = items.sort().map((tag) => {
    let tagActive = false;
    if (Array.isArray(filters.tags)) {
      tagActive = filters.tags
        .map((tag) => tag.toLowerCase())
        .includes(tag.toLowerCase());
    }
    return (
      <li key={tag}>
        <Checkbox
          label={tag}
          checked={tagActive}
          onChange={onChange.bind(null, tag)}
        />
      </li>
    );
  });

  return <ul className="tags">{list}</ul>;
}
