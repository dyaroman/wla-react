import { useState } from 'react';

import { fromCamelCaseToWords } from '../misc/functions';
import { getContrastColor } from '../misc/color';
import { NO_DATA } from '../misc/misc.constants';

export function ColorCell({ column, color, children }) {
  const [transparent, setTransparent] = useState(false);
  const styles = {
    transition: 'background-color 0.3s',
  };

  let title = null;
  if (color !== NO_DATA) {
    title = `click to copy: ${color}`;
    styles.color = getContrastColor(color);
    styles.backgroundColor = color;
  }

  if (transparent) {
    styles.color = '#000';
    styles.backgroundColor = transparent;
  }

  async function onClick() {
    if (color === NO_DATA) return;
    try {
      setTransparent(true);
      await navigator.clipboard.writeText(color);
    } catch (e) {
      console.log(`Error due to copy websites list to clipboard`, e);
    } finally {
      setTimeout(() => {
        setTransparent(false);
      }, 300);
    }
  }

  return (
    <td
      data-title={fromCamelCaseToWords(column)}
      data-qa={column}
      style={styles}
      title={title}
      onClick={onClick}
    >
      {children}
    </td>
  );
}
