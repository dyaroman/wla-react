export function Loader({ fixed = false }) {
  let classes = 'loader';
  if (fixed) classes += '  loader--fixed';

  return (
    <div className={classes}>
      <div className="lds-spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
