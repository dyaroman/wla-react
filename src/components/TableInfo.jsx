import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export function TableInfo() {
  const preparedData = useSelector((state) => state['table'].preparedData);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const { commit, env, timestamp } = websitesData;

  useEffect(() => {
    let title = '';
    if (preparedData) {
      title += `[${preparedData.length}]`;
    }
    if (env) {
      title += `[${env}]`;
    }
    title += `: ${import.meta.env.VITE_PAGE_TITLE}`;
    document.title = title;
  }, [env, preparedData]);

  return (
    <section className="table-info">
      {env && <h4 data-qa="env">Environment: {env}</h4>}
      {commit && (
        <h4 data-qa="commit">
          Commit:{' '}
          <a
            href={`https://dev.azure.com/myorg/websites/_git/websites/commit/${commit}`}
            target="_blank"
            rel="noreferrer"
          >
            {commit.substring(0, 8)}
          </a>
        </h4>
      )}
      {timestamp && <h4 data-qa="timestamp">Data last updated: {timestamp}</h4>}
      {preparedData && (
        <h4 data-qa="websitesNumber">
          {preparedData.length === 1 ? 'Website' : 'Websites'}:{' '}
          {preparedData.length}
        </h4>
      )}
      <h4>
        <a href="./CHANGELOG.md" target="_blank" className="external-link">
          changelog
        </a>
      </h4>
    </section>
  );
}
