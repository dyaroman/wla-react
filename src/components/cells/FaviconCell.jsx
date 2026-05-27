import { ImgCell } from './ImgCell';
import { fromCamelCaseToWords } from '../../misc/functions';
import { NO_DATA } from '../../misc/misc.constants';

export function FaviconCell({ column, websiteData, host }) {
  const image = `https://${host}/${websiteData[column]}`;

  return (
    <td data-title={fromCamelCaseToWords(column)} data-qa={column}>
      {websiteData[column] === NO_DATA ? (
        NO_DATA
      ) : (
        <ImgCell sources={[image]} />
      )}
    </td>
  );
}
