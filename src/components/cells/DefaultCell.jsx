import { Highlight } from '../Highlight';
import { fromCamelCaseToWords } from '../../misc/functions';

export function DefaultCell({ column, websiteData, filters }) {
  return (
    <td data-title={fromCamelCaseToWords(column)} data-qa={column}>
      <Highlight text={websiteData[column]} highlight={filters[column]} />
    </td>
  );
}
