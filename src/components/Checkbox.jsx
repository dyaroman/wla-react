export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="checkbox" data-qa={label}>
      <input
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        onChange={onChange}
      />
      <span className="checkbox__icon"></span>
      <span className="checkbox__label">{label}</span>
    </label>
  );
}
