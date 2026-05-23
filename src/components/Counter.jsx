import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function Counter() {
  const preparedData = useSelector((state) => state['table'].preparedData);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const { env, websites } = websitesData;

  useEffect(() => {
    let title = '';
    if (preparedData) {
      title += `[${preparedData.length}]`;
    }
    if (env) {
      title += `[${env}]`;
    }
    title += `: ${__PAGE_TITLE__}`;
    document.title = title;
  }, [env, preparedData]);

  return (
    <div className="counter" data-qa="counter">
      {preparedData.length < websites.length && `${preparedData.length}/`}
      {websites.length}
    </div>
  );
}
