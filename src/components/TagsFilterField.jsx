import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';

import { MobileFieldTitle } from './MobileFieldTitle';
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

  return (
    <>
      <MobileFieldTitle text="tags" />
      <div className="tags-filter">
        <Tags items={tags} placeholder="select tags below" />
      </div>
    </>
  );
}
