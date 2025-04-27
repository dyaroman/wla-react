import { CHECKBOX_STATES } from '../misc/misc.constants';

export function ThreeStateCheckbox({
  label,
  name,
  currentState = CHECKBOX_STATES.ignore,
  disabled,
  onChange,
}) {
  const nextStates = {
    [CHECKBOX_STATES.ignore]: CHECKBOX_STATES.include,
    [CHECKBOX_STATES.include]: CHECKBOX_STATES.exclude,
    [CHECKBOX_STATES.exclude]: CHECKBOX_STATES.ignore,
  };

  function onChangeHandler() {
    onChange(name, nextStates[currentState]);
  }

  return (
    <label
      className={
        'ts-checkbox' +
        (disabled ? ' disabled' : '') +
        (currentState === CHECKBOX_STATES.include
          ? ` ts-checkbox--${CHECKBOX_STATES.include}`
          : '') +
        (currentState === CHECKBOX_STATES.exclude
          ? ` ts-checkbox--${CHECKBOX_STATES.exclude}`
          : '')
      }
      data-qa={name}
    >
      <input
        type="checkbox"
        className="ts-checkbox__input"
        name={name}
        checked={currentState !== CHECKBOX_STATES.ignore}
        onChange={onChangeHandler}
        tabIndex={disabled ? '-1' : null}
      />
      <span className="ts-checkbox__icon" />
      {label && <span className="ts-checkbox__label">{label}</span>}
    </label>
  );
}
