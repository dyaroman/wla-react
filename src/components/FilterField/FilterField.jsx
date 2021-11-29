import MobileFieldTitle from "../MobileFieldTitle/MobileFieldTitle";

function FilterField({ name, value, onChange, placeholder }) {
  function onChangeHandler(e) {
    onChange(name, e.target.value);
  }

  return (
    <>
      <MobileFieldTitle text={placeholder} />
      <input
        type="text"
        className="input"
        onChange={onChangeHandler}
        placeholder={placeholder}
        value={value}
      />
    </>
  );
}

export default FilterField;
