import { useSelector } from 'react-redux';

export function Counter() {
  const websites = useSelector(
    (state) => state['table'].websitesData?.websites,
  );
  const preparedData = useSelector((state) => state['table'].preparedData);

  return (
    <div className="counter" data-qa="counter">
      {preparedData.length < websites.length && `${preparedData.length}/`}
      {websites.length}
    </div>
  );
}
