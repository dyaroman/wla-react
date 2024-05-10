export function Highlight({ text = '', highlight = '' }) {
  text = String(text);
  highlight = String(highlight);

  if (text === '') {
    return null;
  }

  if (highlight === '') {
    return <span>{text}</span>;
  }

  if (highlight.startsWith('==')) {
    highlight = highlight.slice(2);
  }

  function escapeRegex(string) {
    return string.replace(/[\-\/\\^$*+?.()|\[\]{}]/g, '\\$&');
  }

  const regex = new RegExp(`(${escapeRegex(highlight)})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.filter(String).map((part, i) => {
        return regex.test(part) ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
}
