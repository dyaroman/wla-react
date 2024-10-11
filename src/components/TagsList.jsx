import { useDispatch, useSelector } from 'react-redux';

import { ThreeStateCheckbox } from './ThreeStateCheckbox';
import { triggerGtmEvent } from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';
import { FILTERS_UPDATED } from '../features/table/table.constants';
import { CHECKBOX_STATES } from '../misc/misc.constants';

export function TagsList({ items }) {
  const dispatch = useDispatch();
  const tags = useSelector((state) => state['table'].filters.tags);
  const availableTags = useSelector((state) => state['table'].availableTags);

  function onChange(tag, newState) {
    let updatedTags = [...tags];
    const tagIndex = updatedTags.findIndex((item) => item.includes(tag));

    function updateTag(tagToAdd) {
      if (tagIndex > -1) {
        updatedTags[tagIndex] = tagToAdd;
      } else {
        updatedTags.push(tagToAdd);
      }
    }

    switch (newState) {
      case CHECKBOX_STATES.ignore:
        triggerGtmEvent(gtmEvents.removeTag, {
          label: tag,
        });
        updatedTags = updatedTags.filter((item) => !item.includes(tag));
        break;

      case CHECKBOX_STATES.include:
        triggerGtmEvent(gtmEvents.addTag, {
          label: tag,
          method: newState,
        });
        updateTag(tag);
        break;

      case CHECKBOX_STATES.exclude:
        triggerGtmEvent(gtmEvents.addTag, {
          label: tag,
          method: newState,
        });
        updateTag(`!${tag}`);
        break;
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
    const lowerTag = tag.toLowerCase();
    const tagAvailable = availableTags.some((availableTag) =>
      availableTag.toLowerCase().includes(lowerTag),
    );
    const tagIncludes = tags.some((t) => t.toLowerCase() === lowerTag);
    const tagExcludes = tags.some((t) => t.toLowerCase() === `!${lowerTag}`);

    let currentState;
    if (tagIncludes) {
      currentState = CHECKBOX_STATES.include;
    } else if (tagExcludes) {
      currentState = CHECKBOX_STATES.exclude;
    } else {
      currentState = CHECKBOX_STATES.ignore;
    }

    const isTagInteractable = tagAvailable || tagIncludes || tagExcludes;

    return (
      <li key={tag}>
        <ThreeStateCheckbox
          name={tag}
          label={tag}
          currentState={currentState}
          disabled={!isTagInteractable}
          onChange={isTagInteractable ? onChange : undefined}
        />
      </li>
    );
  });

  return <ul className="tags-list">{list}</ul>;
}
