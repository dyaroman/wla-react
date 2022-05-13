import { NO_DATA } from './constants';

export function search(where, what) {
  return String(where).toLowerCase().includes(String(what).toLowerCase());
}

export function updateURL(sortAndFilterState) {
  if (Object.keys(sortAndFilterState).length === 0) {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  for (const key in sortAndFilterState) {
    switch (key) {
      case 'tags':
        if (sortAndFilterState[key].length === 0) {
          params.delete(key);
        } else {
          params.set(key, sortAndFilterState[key].join());
        }
        break;

      default:
        if (sortAndFilterState[key] === '') {
          params.delete(key);
        } else {
          params.set(key, sortAndFilterState[key]);
        }
        break;
    }
  }
  if (params.toString() === '') {
    window.history.pushState({}, '', '/');
  } else {
    window.history.pushState({}, '', `?${params}`);
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

export function sortTableData(array, sortColumn) {
  const noDataItems = [];
  const sortedArray = [...array]
    .filter((item) => {
      switch (sortColumn) {
        default:
          if (item[sortColumn] === NO_DATA) {
            noDataItems.push(item);
            return false;
          } else {
            return true;
          }
      }
    })
    .sort((a, b) => {
      switch (sortColumn) {
        case 'campaignId':
          return Number(a[sortColumn]) > Number(b[sortColumn]) ? 1 : -1;

        default:
          return String(a[sortColumn]).toLowerCase() >
            String(b[sortColumn]).toLowerCase()
            ? 1
            : -1;
      }
    });

  return [...sortedArray, ...noDataItems];
}

export function fromCamelCaseToWords(str) {
  const result = str.replace(/([A-Z\d])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
