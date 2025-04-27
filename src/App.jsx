import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader } from './components/Loader';
import { Table } from './components/Table';
import { InfoModal } from './components/InfoModal';
import { ImgPreviewModal } from './components/ImgPreviewModal';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { Drawer } from './components/Drawer';
import { TableControls } from './components/TableControls';
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

  if (requestError) {
    return (
      <section data-qa="loadError">
        <div className="container">
          <h1>Failed to load websites data</h1>
          <p>{requestError}</p>
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
      data-sidebar={sidebarOpen ? 'open' : null}
      className="app"
    >
      <Sidebar />
      <>
        <div className="btn-group">
          <button
            // onClick={() => setShowColumnsCustomization(true)}
            // data-qa="customizeColumnsButton"
            className="btn"
          >
            Filters
          </button>
          <button
            // onClick={() => setShowColumnsCustomization(true)}
            data-qa="customizeColumnsButton"
            className="btn"
          >
            Customize Columns
          </button>
        </div>
        <Drawer
          // isOpen={showColumnsCustomization}
          // onClose={() => setShowColumnsCustomization(false)}
          title="Customize Columns"
          position="right"
        >
          <TableControls />
        </Drawer>
      </>
      <Table />
      <InfoModal />
      <ImgPreviewModal />
      <Toast />
    </section>
  );
}
