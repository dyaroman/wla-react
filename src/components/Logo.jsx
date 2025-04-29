import { useSelector } from 'react-redux';

export function Logo() {
  const websitesDataSource = useSelector(
    (state) => state['table'].websitesDataSource,
  );

  function onClick() {
    document
      .querySelector('.table')
      .scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  return (
    <button
      className={
        'logo' + (websitesDataSource === 'file' ? ' logo--fallback' : '')
      }
      aria-label="scroll table to the top"
      onClick={onClick}
    >
      WL<span>A</span>
    </button>
  );
}
