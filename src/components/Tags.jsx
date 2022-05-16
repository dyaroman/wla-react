import { useDispatch, useSelector } from 'react-redux';

import { FILTERS_UPDATED } from '../features/table/table.constants';

export function Tags({ items }) {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state['table']);

  function onClick(e) {
    let updatedTags = [...filters.tags];
    const currentTag = e.target.innerText;
    if (updatedTags.includes(currentTag)) {
      updatedTags = updatedTags.filter((item) => item !== currentTag);
    } else {
      updatedTags.push(currentTag);
    }
    dispatch({
      type: FILTERS_UPDATED,
      payload: {
        tags: updatedTags,
      },
    });
  }

  if (!items) {
    return null;
  }

  const list = items.sort().map((tag) => {
    let tagActive = null;
    if (Array.isArray(filters.tags)) {
      tagActive = filters.tags
        .map((tag) => tag.toLowerCase())
        .includes(tag.toLowerCase())
        ? ''
        : null;
    }
    return (
      <li key={tag}>
        <button
          className="tags__btn"
          data-qa={tag}
          data-tag-active={tagActive}
          onClick={onClick}
        >
          {tag}
        </button>
      </li>
    );
  });

  return <ul className="tags">{list}</ul>;
}
