import { Highlight } from '../Highlight';
import { fromCamelCaseToWords } from '../../misc/functions';

export function WebsiteCell({ column, websiteData, host, filters }) {
  return (
    <td data-title={fromCamelCaseToWords(column)} data-qa={column}>
      <a href={`https://${host}`} target="_blank" rel="noreferrer">
        <Highlight text={websiteData[column]} highlight={filters[column]} />
      </a>
    </td>
  );
}
