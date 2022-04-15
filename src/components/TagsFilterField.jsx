import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';

import { FieldTitle } from './FieldTitle';
import { Tags } from './Tags';

export function TagsFilterField() {
  const { filters, preparedData } = useSelector((state) => state['table']);
  const getTags = useCallback(() => {
    const tags = [];
    for (const website of preparedData) {
      for (const tag of website.tags) {
        if (tags.includes(tag) === false) {
          tags.push(tag);
        }
      }
    }
    return tags;
  }, [preparedData]);
  const [tags, setTags] = useState(getTags);

  useEffect(() => {
    setTags(getTags);
  }, [filters.tags, getTags]);

  if (!tags) {
    return null;
  }

  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <FieldTitle text="tags">
        <Tags items={tags} />
      </FieldTitle>
    </div>
  );
}
