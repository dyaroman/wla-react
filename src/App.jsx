import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader } from './components/Loader';
import { Table } from './components/Table';
import { InfoModal } from './components/InfoModal';
import { ImgPreviewModal } from './components/ImgPreviewModal';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { getURLParams, getWebsitesData } from './features/table/table.actions';

export function App() {
  const dispatch = useDispatch();
  const unauthorized = useSelector((state) => state['app'].unauthorized);
  const requestError = useSelector((state) => state['app'].requestError);
  const websitesDataLoaded = useSelector(
    (state) => state['table'].websitesDataLoaded,
  );
  const sidebarOpen = useSelector((state) => state['app'].sidebarOpen);

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
      <section data-qa="smsPubsites">
        <div className="container">
          <h1>We temporarily stop supporting Websites</h1>
          <p>
            If you need more detail about it, please contact me in slack:
            @dyaroman
          </p>
        </div>
      </section>
    );
  }

  if (requestError) {
    return (
      <section data-qa="loadError">
        <div className="container">
          <h1>Error due to load websites data</h1>
          <p>Status code: {requestError}</p>
        </div>
      </section>
    );
  }

  if (unauthorized === true) {
    return (
      <section data-qa="unauthorized">
        <div className="container">
          <h1>Unauthorized</h1>
          <p>Please check your connection</p>
        </div>
      </section>
    );
  }

  if (websitesDataLoaded === false) {
    return (
      <section data-qa="loader">
        <Loader fixed={true} />
      </section>
    );
  }

  return (
    <section
      data-qa="app"
      data-sidebar={sidebarOpen ? 'open' : undefined}
      className="app"
    >
      <Sidebar />
      <Table />
      <InfoModal />
      <ImgPreviewModal />
      <Toast />
    </section>
  );
}
