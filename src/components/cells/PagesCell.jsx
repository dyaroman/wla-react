import { Highlight } from '../Highlight';
import { fromCamelCaseToWords } from '../../misc/functions';
import { NO_DATA } from '../../misc/misc.constants';

export function PagesCell({ column, websiteData, host, filters }) {
  return (
    <td data-title={fromCamelCaseToWords(column)} data-qa={column}>
      {websiteData[column].length ? (
        <ul>
          {websiteData[column].map((page) => (
            <li key={page}>
              <a
                href={`https://${host}/${page}`}
                target="_blank"
                rel="noreferrer"
              >
                <Highlight text={page} highlight={filters[column]} />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        NO_DATA
      )}
    </td>
  );
}
