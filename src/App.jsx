import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader } from './components/Loader';
import { Table } from './components/Table';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { ToggleButtonsPanel } from './components/ToggleButtonsPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { Shortcuts } from './components/Shortcuts';
import { InfoModal } from './components/InfoModal';
import { getURLParams, getWebsitesData } from './features/table/table.actions';

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
    <section data-qa="app" className="app">
      <Header />
      <ThemeToggle />
      <Shortcuts />
      <ToggleButtonsPanel />
      <Table />
      <Toast />
      <InfoModal />
    </section>
  );
}
