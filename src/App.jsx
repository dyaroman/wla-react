import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader } from './components/Loader';
import { AppControls } from './components/AppControls';
import { TableInfo } from './components/TableInfo';
import { Filters } from './components/Filters';
import { Table } from './components/Table';
import { InfoModal } from './components/InfoModal';
import { ImgPreviewModal } from './components/ImgPreviewModal';
import { getURLParams, getWebsitesData } from './features/table/table.actions';
import { TableControls } from './components/TableControls';

export function App() {
  const dispatch = useDispatch();
  const unauthorized = useSelector((state) => state['app'].unauthorized);
  const requestError = useSelector((state) => state['app'].requestError);
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

  if (window.location.host.includes('websites')) {
    return (
      <main data-qa="websites">
        <h1>We temporarily stop supporting Websites</h1>
        <p>
          If you need more detail about it, please contact me in slack: @dyaroman
        </p>
      </main>
    );
  }

  if (requestError) {
    return (
      <main data-qa="load-error">
        <h1>Error due to load websites data</h1>
        <p>Status code: {requestError}</p>
      </main>
    );
  }

  if (unauthorized === true) {
    return (
      <main data-qa="unauthorized">
        <h1>Unauthorized</h1>
        <p>Please check your connection</p>
      </main>
    );
  }

  if (websitesDataLoaded === false) {
    return (
      <main data-qa="loader">
        <Loader fixed={true} />
      </main>
    );
  }

  return (
    <main data-qa="app">
      <AppControls />
      <TableInfo />
      <Filters />
      <TableControls />
      <Table />
      <InfoModal />
      <ImgPreviewModal />
    </main>
  );
}
