import { fromCamelCaseToWords } from '../misc/functions';
import { getContrastColor } from '../misc/color';

export function ColorCell({ column, color, children }) {
  const styles = {};
  if (color.startsWith('#')) {
    styles.color = getContrastColor(color);
    styles.backgroundColor = color;
  }

  async function onClick() {
    try {
      await navigator.clipboard.writeText(color);
    } catch (e) {
      console.log(`Error due to copy websites list to clipboard`, e);
    }
  }

  return (
    <td
      data-title={fromCamelCaseToWords(column)}
      data-qa={column}
      style={styles}
      title={`click to copy: ${color}`}
      onClick={onClick}
    >
      {children}
    </td>
  );
}
