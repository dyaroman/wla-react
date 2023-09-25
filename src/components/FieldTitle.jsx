export function FieldTitle({ text, children }) {
  if (!text) {
    return null;
  }

  return (
    <label className="field-title">
      <span className="field-title__text">{text}</span>
      {children}
    </label>
  );
}
