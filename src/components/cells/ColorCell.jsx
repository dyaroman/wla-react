import { fromCamelCaseToWords } from '../../misc/functions';
import { getContrastColor } from '../../misc/color';
import { NO_DATA } from '../../misc/misc.constants';

export function ColorCell({ column, bgColor, children }) {
  const styles = {};

  if (bgColor !== NO_DATA) {
    styles.color = getContrastColor(bgColor);
    styles.backgroundColor = bgColor;
  }

  return (
    <td
      data-title={fromCamelCaseToWords(column)}
      data-qa={column}
      style={styles}
    >
      {children}
    </td>
  );
}
