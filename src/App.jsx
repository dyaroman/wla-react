import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader } from './components/Loader';
import { Table } from './components/Table';
import { Info } from './components/Info';
import { Filters } from './components/Filters';
import { InfoModal } from './components/InfoModal';
import { getURLParams, getWebsitesData } from './features/table/table.actions';

export function App() {
  const dispatch = useDispatch();
  const unauthorized = useSelector((state) => state['table'].unauthorized);
  const websitesDataLoaded = useSelector(
    (state) => state['table'].websitesDataLoaded
  );

  useEffect(() => {
    dispatch(getWebsitesData());
    dispatch(getURLParams());
  }, [dispatch]);

  if (websitesDataLoaded === false) {
    return <Loader />;
  }

  if (unauthorized === true) {
    return (
      <>
        <h1>Unauthorized</h1>
        <p>Please check your connection</p>
      </>
    );
  }

  return (
    <>
      <InfoModal />
      <Info />
      <Filters />
      <Table />
    </>
  );
}
