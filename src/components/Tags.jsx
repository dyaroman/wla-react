import { useDispatch, useSelector } from 'react-redux';

import { TagsList } from './TagsList';
import { resetTags } from '../features/table/table.actions';

export function Tags() {
  const dispatch = useDispatch();
  const tags = useSelector((state) => state['table'].allTags);

  function onResetTags() {
    dispatch(resetTags());
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="tags">
      <button
        className="btn btn--danger"
        onClick={onResetTags}
        data-qa="resetTags"
      >
        reset tags
      </button>

      <TagsList items={tags} />
    </div>
  );
}
