import { useSelector } from 'react-redux';

import { TagsList } from './TagsList';

export function TagsFilterField() {
  const tags = useSelector((state) => state['table'].allTags);

  if (tags.length === 0) {
    return null;
  }

  return (
    <details className="tags" open>
      <summary>Tags:</summary>
      <TagsList items={tags} />
    </details>
  );
}
