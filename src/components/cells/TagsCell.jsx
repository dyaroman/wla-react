import { TagsList } from '../TagsList';
import { fromCamelCaseToWords } from '../../misc/functions';
import { NO_DATA } from '../../misc/misc.constants';

export function TagsCell({ column, websiteData }) {
  return (
    <td data-title={fromCamelCaseToWords(column)} data-qa={column}>
      {websiteData.tags.length ? (
        <TagsList items={websiteData.tags} />
      ) : (
        NO_DATA
      )}
    </td>
  );
}
