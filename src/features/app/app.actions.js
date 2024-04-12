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
    // check if showColumns equal to default columns
    // in this case we don't want to save it in URL
    const columns = getState()?.table?.websitesData?.columns;
    // todo move default showed columns to store
    const defaultShowedColumns = Object.keys(columns).filter(
      (column) => columns[column]['showColumn'],
    );

    if (
      newState['showColumns'].every((column) =>
        defaultShowedColumns.includes(column),
      )
    ) {
      params.delete('showColumns');
    }

    if (params.toString() === '') {
      window.history.replaceState({}, '', '/');
    } else {
      window.history.replaceState({}, '', `?${params}`);
    }
  };
}
