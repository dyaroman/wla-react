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
      case 'website':
        return (
          website['folderName'] && search(website['folderName'], filterValue)
        );
      case 'mainForm':
        return (
          website['MAIN_FORM'] &&
          search(website['MAIN_FORM']['NAME'], filterValue)
        );
      case 'altForm':
        return (
          website['ALT_FORM'] &&
          search(website['ALT_FORM']['NAME'], filterValue)
        );
      case 'tags':
        return [...filterValue].every((filterTag) =>
          website['tags']
            .map((tag) => tag.toLowerCase())
            .includes(filterTag.toLowerCase())
        );
      case 'owner':
      case 'companyName':
      case 'email':
      case 'emailLegal':
      case 'campaignId':
      case 'template':
      case 'gtmKey':
      case 'recaptchaKey':
      case 'address1':
      case 'address2':
        return website[filterBy] && search(website[filterBy], filterValue);
      default:
        return website;
    }
  });
}

export function sortTableData(array, sortColumn) {
  const noDataItems = [];
  const sortedArray = [...array]
    .filter((item) => {
      switch (sortColumn) {
        case 'mainForm':
          if (item['MAIN_FORM'] && item['MAIN_FORM']['NAME'] === NO_DATA) {
            noDataItems.push(item);
            return false;
          } else {
            return true;
          }
        case 'altForm':
          if (item['ALT_FORM'] && item['ALT_FORM']['NAME'] === NO_DATA) {
            noDataItems.push(item);
            return false;
          } else {
            return true;
          }
        case 'template':
        case 'campaignId':
        case 'owner':
        case 'gtmKey':
        case 'recaptchaKey':
        case 'companyName':
        case 'email':
        case 'emailLegal':
        case 'address1':
        case 'address2':
          if (item[sortColumn] === NO_DATA) {
            noDataItems.push(item);
            return false;
          } else {
            return true;
          }
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortColumn) {
        case 'mainForm':
          let aValue = a['MAIN_FORM'] && a['MAIN_FORM']['NAME'];
          let bValue = b['MAIN_FORM'] && b['MAIN_FORM']['NAME'];
          return String(aValue).toLowerCase() > String(bValue).toLowerCase()
            ? 1
            : -1;
        case 'altForm': {
          let aValue = a['ALT_FORM'] && a['ALT_FORM']['NAME'];
          let bValue = b['ALT_FORM'] && b['ALT_FORM']['NAME'];
          return String(aValue).toLowerCase() > String(bValue).toLowerCase()
            ? 1
            : -1;
        }
        case 'website':
          return String(a['folderName']).toLowerCase() >
            String(b['folderName']).toLowerCase()
            ? 1
            : -1;
        case 'campaignId':
          return Number(a[sortColumn]) > Number(b[sortColumn]) ? 1 : -1;
        case 'owner':
        case 'companyName':
        case 'email':
        case 'emailLegal':
        case 'template':
        case 'gtmKey':
        case 'recaptchaKey':
        case 'address1':
        case 'address2':
          return String(a[sortColumn]).toLowerCase() >
            String(b[sortColumn]).toLowerCase()
            ? 1
            : -1;
        default:
          return 0;
      }
    });

  return [...sortedArray, ...noDataItems];
}
