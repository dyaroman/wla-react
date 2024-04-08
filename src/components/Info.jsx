import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export function TableInfo() {
  const preparedData = useSelector((state) => state['table'].preparedData);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const {
    commit = '',
    env = '',
    project = '',
    repoPath = '',
    timestamp = '',
  } = websitesData;

  useEffect(() => {
    if (project === '' && env === '') return;
    document.title = `${project && `[${project}]`}${env && `[${env}]`}: ${
      process.env.REACT_APP_PAGE_TITLE
    }`;
  }, [project, env]);

  return (
    <section className="info">
      {env && <h4 data-qa="env">Environment: {env}</h4>}
      {repoPath && commit && (
        <h4>
          Commit:{' '}
          <a
            href={`https://dev.azure.com/myorg/${repoPath}/commit/${commit}`}
            target="_blank"
            rel="noreferrer"
            data-qa="commit"
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
    </section>
  );
}
