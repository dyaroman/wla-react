import { useSelector } from 'react-redux';

export function Counter() {
  const preparedData = useSelector((state) => state['table'].preparedData);

  return (
    <div className="counter" data-qa="counter">
      {preparedData.length}
    </div>
  );
}
