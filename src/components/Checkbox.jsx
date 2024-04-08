export function Checkbox({ label, checked, disabled, onChange }) {
  return (
    <label
      className={'checkbox' + (disabled ? ' disabled' : '')}
      data-qa={label}
    >
      <input
        type="checkbox"
        className="checkbox__input"
        name={label}
        checked={checked}
        onChange={onChange}
      />
      <span className="checkbox__icon"></span>
      <span className="checkbox__label">{label}</span>
    </label>
  );
}
