import { NO_DATA } from './misc.constants';
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

export function filterTableData(websites, filters) {
  return websites.filter((website) => {
    for (const filter in filters) {
      // skip filters that are in the process of typing
      if (['', '=', '==', '!', '!='].includes(filters[filter])) {
        continue;
      }
      switch (filter) {
        case COLUMNS.tags:
          if (
            ![...filters[filter]].every((filterTag) =>
              website[COLUMNS.tags]
                .map((tag) => tag.toLowerCase())
                .includes(filterTag.toLowerCase()),
            )
          ) {
            return false;
          }
          break;

        case COLUMNS.pages:
          if (
            filters[filter].startsWith('==') &&
            website[filter].every((page) => search(page, filters[filter]))
          ) {
            return false;
          } else if (
            filters[filter].startsWith('!=') &&
            !website[filter].every((page) => search(page, filters[filter]))
          ) {
            return false;
          } else if (
            !website[filter].some((page) => search(page, filters[filter]))
          ) {
            return false;
          }
          break;

        default:
          if (!(website[filter] && search(website[filter], filters[filter]))) {
            return false;
          }
          break;
      }
    }
    return true;
  });
}

export function sortTableData(array, column) {
  const noDataItems = [];
  const sortedArray = [...array]
    .filter((item) => {
      switch (column) {
        default:
          if (item[column] === NO_DATA) {
            noDataItems.push(item);
            return false;
          } else {
            return true;
          }
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

export function getQueryParamValue(key) {
  return new URLSearchParams(window.location.search).get(key);
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

export function convertUrlToEnv(website = '', env = '', project = '') {
  const lowerWebsite = website.replaceAll('.', '_').toLowerCase();

  switch (project) {
    case 'websites':
      switch (env) {
        case 'dev':
          return `${lowerWebsite}.example.com`;
        case 'prod':
          return website.toLowerCase();
      }
      break;
    case 'websites':
      switch (env) {
        case 'demo':
          return `${lowerWebsite}.dev.example.com`;
        case 'prod':
          return website.toLowerCase();
      }
      break;
  }

  return null;
}

export function triggerGtmEvent(eventName, options = {}) {
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
