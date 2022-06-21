export function Highlight({ text = '', highlight = '' }) {
  text = String(text);
  highlight = String(highlight);

  if (text.trim() === '') {
    return null;
  }

  if (highlight.trim() === '') {
    return text;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.filter(String).map((part, i) => {
        return regex.test(part) ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}
