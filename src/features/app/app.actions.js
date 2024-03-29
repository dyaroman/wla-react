export function updateURL(newState) {
  return function (dispatch, getState) {
    if (!getState().app.urlParamsRead) return;
    if (Object.keys(newState).length === 0) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    for (const key in newState) {
      switch (key) {
        case 'showedColumns':
        case 'tags':
          if (newState[key].length === 0) {
            params.delete(key);
          } else {
            params.set(key, newState[key].join());
          }
          break;

        default:
          if (newState[key] === '') {
            params.delete(key);
          } else {
            params.set(key, newState[key]);
          }
          break;
      }
    }
    if (params.toString() === '') {
      window.history.replaceState({}, '', '/');
    } else {
      window.history.replaceState({}, '', `?${params}`);
    }
  };
}
