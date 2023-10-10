export function updateURL(sortAndFilterState) {
  return function (dispatch, getState) {
    if (!getState().app.urlParamsRead) return;
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
  };
}
