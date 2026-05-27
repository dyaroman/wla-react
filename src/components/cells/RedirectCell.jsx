import { Highlight } from '../Highlight';
import { fromCamelCaseToWords } from '../../misc/functions';
import { NO_DATA } from '../../misc/misc.constants';

export function RedirectCell({ column, websiteData, filters }) {
  return (
    <td data-title={fromCamelCaseToWords(column)} data-qa={column}>
      {websiteData[column] === NO_DATA ? (
        <Highlight text={websiteData[column]} highlight={filters[column]} />
      ) : (
        <a href={websiteData[column]} target="_blank" rel="noreferrer">
          <Highlight
            text={websiteData[column].replace('https://', '').replace('/', '')}
            highlight={filters[column]}
          />
        </a>
      )}
    </td>
  );
}
