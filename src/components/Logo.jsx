export function Logo() {
  function onClick() {
    document
      .querySelector('.table')
      .scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  return (
    <button
      className="logo"
      aria-label="scroll table to the top"
      onClick={onClick}
    >
      WLA
    </button>
  );
}
