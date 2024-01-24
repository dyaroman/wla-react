import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader } from './components/Loader';
import { Controls } from './components/Controls';
import { Info } from './components/Info';
import { Filters } from './components/Filters';
import { Table } from './components/Table';
import { InfoModal } from './components/InfoModal';
import { ImgPreviewModal } from './components/ImgPreviewModal';
import { getURLParams, getWebsitesData } from './features/table/table.actions';

export function App() {
  const dispatch = useDispatch();
  const { unauthorized, requestError } = useSelector((state) => state['app']);
  const websitesDataLoaded = useSelector(
    (state) => state['table'].websitesDataLoaded,
  );

  useEffect(() => {
    dispatch(getWebsitesData());
  }, []);

  useEffect(() => {
    if (websitesDataLoaded) {
      dispatch(getURLParams());
    }
  }, [websitesDataLoaded]);

  if (websitesDataLoaded === false) {
    return <Loader fixed={true} />;
  }

  if (unauthorized === true) {
    return (
      <>
        <h1>Unauthorized</h1>
        <p>Please check your connection</p>
      </>
    );
  }

  if (requestError) {
    return (
      <>
        <h1>Error due to request.</h1>
        <p>Status code: {requestError}</p>
      </>
    );
  }

  return (
    <>
      <Controls />
      <Info />
      <Filters />
      <Table />
      <InfoModal />
      <ImgPreviewModal />
    </>
  );
}
