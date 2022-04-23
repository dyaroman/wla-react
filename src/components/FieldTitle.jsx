export function FieldTitle({ text, children, clickable = true }) {
  if (!text) {
    return null;
  }

  if (clickable === false) {
    return (
      <span className="field-title">
        <span className="field-title__text">{text}</span>
        {children}
      </span>
    );
  }

  return (
    <label className="field-title">
      <span className="field-title__text">{text}</span>
      {children}
    </label>
  );
}
