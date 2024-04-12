export function updateURL(newState) {
  return function (dispatch, getState) {
    if (!getState().app.urlParamsRead) return;
    if (Object.keys(newState).length === 0) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    for (const key in newState) {
      switch (key) {
        case 'showColumns':
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

    // check if showColumns equal to defaultShowColumns
    // in this case we don't want to save it in URL
    const defaultShowColumns = getState()?.table?.defaultShowColumns;
    if (
      newState['showColumns'].length === defaultShowColumns.length &&
      newState['showColumns'].every((column) =>
        defaultShowColumns.includes(column),
      )
    ) {
      params.delete('showColumns');
    }

    // check if showColumns equal to renderableColumns
    // in this case we should use alias 'all'
    const renderableColumns = getState()?.table?.renderableColumns;
    if (
      newState['showColumns'].length === renderableColumns.length &&
      newState['showColumns'].every((column) =>
        renderableColumns.includes(column),
      )
    ) {
      params.set('showColumns', 'all');
    }

    // check if showColumns is an empty array
    // in this case we should use alias 'none'
    if (
      params.get('showColumns') === null &&
      newState['showColumns'].length === 0
    ) {
      params.set('showColumns', 'none');
    }

    if (params.toString() === '') {
      window.history.replaceState({}, '', '/');
    } else {
      window.history.replaceState({}, '', `?${params}`);
    }
  };
}
