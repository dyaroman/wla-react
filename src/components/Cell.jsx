import { fromCamelCaseToWords } from '../misc/functions';

export function Cell({ column, children }) {
  return (
    <td data-title={fromCamelCaseToWords(column)} data-qa={column}>
      {children}
    </td>
  );
}
