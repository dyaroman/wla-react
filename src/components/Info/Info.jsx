import { useDispatch, useSelector } from 'react-redux';

import { CLEAR_FILTERS } from '../../features/table/table.constants';

export function Info() {
  const dispatch = useDispatch();
  const { preparedData, websitesData } = useSelector((state) => state['table']);
  const { timestamp = '', commit = '', repoPath = '' } = websitesData;

  function onClickClearAll() {
    dispatch({
      type: CLEAR_FILTERS,
    });
  }

  return (
    <section className="info">
      {timestamp && <h4>Data last updated: {timestamp}</h4>}
      {repoPath && commit && (
        <h4>
          Commit:{' '}
          <a
            href={`https://dev.azure.com/myorg/${repoPath}/commit/${commit}`}
            target="_blank"
            rel="noreferrer"
          >
            {commit.substring(0, 10)}
          </a>
        </h4>
      )}
      {preparedData && (
        <h4>
          {preparedData.length === 1 ? 'Result' : 'Results'}:{' '}
          {preparedData.length}
        </h4>
      )}
      <button onClick={onClickClearAll}>clear all</button>
    </section>
  );
}
