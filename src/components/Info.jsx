import { useSelector } from 'react-redux';

export function Info() {
  const { preparedData, websitesData } = useSelector((state) => state['table']);
  const { timestamp = '', commit = '', repoPath = '', ENV = '' } = websitesData;

  return (
    <section className="info">
      {ENV && <h4>ENV: {ENV}</h4>}
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
    </section>
  );
}
