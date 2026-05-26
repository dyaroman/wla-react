import { EXCLUSION_PREFIX, NO_DATA } from './misc.constants';
import { COLUMNS } from './columns.constants';

export function search(where, what) {
  where = String(where).toLowerCase();
  what = String(what).toLowerCase();

  if (what.startsWith('==')) {
    return where === what.slice(2);
  } else if (what.startsWith('!=')) {
    return where !== what.slice(2);
  } else {
    return where.includes(what);
  }
}

export function filterTableData(websites, filters, tags) {
  return websites.filter((website) => {
    for (const filter in filters) {
      // skip filters that are in the process of typing
      if (['', '=', '==', '!', '!='].includes(filters[filter])) {
        continue;
      }
      switch (filter) {
        case COLUMNS.pages: {
          if (
            // strict equal
            (filters[filter].startsWith('==') &&
              !website[filter].some((page) => search(page, filters[filter]))) ||
            // strict not equal
            (filters[filter].startsWith('!=') &&
              !website[filter].every((page) =>
                search(page, filters[filter]),
              )) ||
            // includes
            (!filters[filter].startsWith('==') &&
              !filters[filter].startsWith('!=') &&
              !website[filter].some((page) => search(page, filters[filter])))
          ) {
            return false;
          }
          break;
        }

        default: {
          if (!website[filter] || !search(website[filter], filters[filter])) {
            return false;
          }
          break;
        }
      }
    }

    if (!tags || tags.length === 0) return true;

    // filter by tags
    const normalizedWebsiteTags = website[COLUMNS.tags].map((tag) =>
      tag.toLowerCase(),
    );

    const requiredTags = tags
      .filter((tag) => !tag.startsWith(EXCLUSION_PREFIX))
      .map((tag) => tag.toLowerCase());

    const excludedTags = tags
      .filter((tag) => tag.startsWith(EXCLUSION_PREFIX))
      .map((tag) => tag.substring(1).toLowerCase());

    const hasAllRequiredTags = requiredTags.every((tag) =>
      normalizedWebsiteTags.includes(tag),
    );

    const hasNoExcludedTags = excludedTags.every(
      (tag) => !normalizedWebsiteTags.includes(tag),
    );

    return hasAllRequiredTags && hasNoExcludedTags;
  });
}

export function sortTableData(array, column) {
  const noDataItems = [];
  const sortedArray = [...array]
    .filter((item) => {
      if (item[column] === NO_DATA) {
        noDataItems.push(item);
        return false;
      } else {
        return true;
      }
    })
    .sort((a, b) => {
      switch (column) {
        case COLUMNS.campaignId:
          return Number(a[column]) > Number(b[column]) ? 1 : -1;

        default:
          return String(a[column]).toLowerCase() >
            String(b[column]).toLowerCase()
            ? 1
            : -1;
      }
    });

  return [...sortedArray, ...noDataItems];
}

export function getQueryParamValue(targetKey) {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of params) {
    if (key.toLowerCase() === targetKey.toLowerCase()) {
      return value;
    }
  }
}

export function setQueryParam(key, value) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, value);
  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}?${searchParams}`,
  );
}

export function deleteQueryParam(key) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete(key);
  const newUrl = searchParams.toString()
    ? `${window.location.pathname}?${searchParams}`
    : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}

export function fromCamelCaseToWords(str) {
  return str
    .split(/(?=[A-Z0-9])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/([A-Z]+) /g, '$1');
}

export function convertUrlToEnv(website = '', env = '') {
  const lowerWebsite = website.replaceAll('.', '_').toLowerCase();

  switch (env) {
    case 'dev':
      return `${lowerWebsite}.example.com`;

    case 'prod':
      return website.toLowerCase();
  }

  return null;
}

export function triggerGtmEvent(eventName, options = {}) {
  if (import.meta.env.DEV) return;
  window.dataLayer?.push({
    event: eventName,
    ...options,
  });
}

export function getUniqueTags(websites) {
  const uniqueTags = websites.reduce((acc, website) => {
    website.tags.forEach((tag) => acc.add(tag));
    return acc;
  }, new Set());
  return [...uniqueTags];
}

export function getUniqueValues(arr, propertyName) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }

  if (typeof propertyName !== 'string' || propertyName === '') {
    console.error('Property name must be a non-empty string.');
    return [];
  }

  const uniqueValues = new Set();

  for (const obj of arr) {
    if (obj && obj.hasOwnProperty(propertyName)) {
      const propertyValue = obj[propertyName];
      if (Array.isArray(propertyValue)) {
        for (const value of propertyValue) {
          uniqueValues.add(value);
        }
      } else {
        uniqueValues.add(propertyValue);
      }
    }
  }

  return Array.from(uniqueValues);
}

export function findObjectKeyCaseInsensitive(key, obj) {
  for (const objKey in obj) {
    if (
      obj.hasOwnProperty(objKey) &&
      objKey.toLowerCase() === key.toLowerCase()
    ) {
      return objKey;
    }
  }
}

export function findArrayElementCaseInsensitive(key, arr) {
  return arr.find((el) => el.toLowerCase() === key.toLowerCase());
}

export async function handleClipboardCopy(data) {
  try {
    await navigator.clipboard.writeText(data);
  } catch (e) {
    console.log(`Failed copy data to clipboard`, e.message);
  }
}

export function filterAndSortColumns(columns, state) {
  return columns
    .filter((column) => state.renderableColumns.includes(column))
    .sort(
      (a, b) =>
        state.websitesData.columns.findIndex((col) => col.name === a) -
        state.websitesData.columns.findIndex((col) => col.name === b),
    );
}
