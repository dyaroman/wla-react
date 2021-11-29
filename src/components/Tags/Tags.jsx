import { NO_DATA } from "../../misc/constants";

function Tags({ tags, filters, setFilters, placeholder = NO_DATA }) {
  function tagClickHandler(e) {
    const updatedTags = filters.tags;
    const currentTag = e.target.innerText;
    if (updatedTags.has(currentTag)) {
      updatedTags.delete(currentTag);
    } else {
      updatedTags.add(currentTag);
    }
    setFilters({
      ...filters,
      ...updatedTags,
    });
  }

  if (Array.isArray(tags) && tags.length > 0) {
    const list = tags.sort().map((tag) => {
      const tagActive = [...filters.tags]
        .map((tag) => tag.toLowerCase())
        .includes(tag.toLowerCase())
        ? ""
        : null;
      return (
        <li key={tag}>
          <button
            className="tags__btn"
            data-tag-active={tagActive}
            onClick={tagClickHandler}
          >
            {tag}
          </button>
        </li>
      );
    });
    return <ul className="tags">{list}</ul>;
  } else {
    return placeholder;
  }
}

export default Tags;
