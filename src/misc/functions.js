import { NO_DATA } from './constants';

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

export function filterTableData(filterBy, filterValue, websites) {
  return websites.filter((website) => {
    switch (filterBy) {
      case 'tags':
        return [...filterValue].every((filterTag) =>
          website['tags']
            .map((tag) => tag.toLowerCase())
            .includes(filterTag.toLowerCase())
        );

      default:
        return website[filterBy] && search(website[filterBy], filterValue);
    }
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
        case 'campaignId':
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
