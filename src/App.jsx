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
import { Filters } from './components/Filters';
import { Tags } from './components/Tags';
import { getURLParams, getWebsitesData } from './features/table/table.actions';
import {
  TOGGLE_CUSTOMIZATION_COLUMNS_OPENED,
  TOGGLE_FILTERS_OPENED,
  TOGGLE_TAGS_OPENED,
} from './features/app/app.constants';

export function App() {
  const dispatch = useDispatch();
  const unauthorized = useSelector((state) => state['app'].unauthorized);
  const requestError = useSelector((state) => state['app'].requestError);
  const websitesDataLoaded = useSelector(
    (state) => state['table'].websitesDataLoaded,
  );
  const sidebarOpened = useSelector((state) => state['app'].sidebarOpened);
  const customizationColumnsOpened = useSelector(
    (state) => state['app'].customizationColumnsOpened,
  );
  const filtersOpened = useSelector((state) => state['app'].filtersOpened);
  const tagsOpened = useSelector((state) => state['app'].tagsOpened);

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
      data-sidebar={sidebarOpened ? 'open' : null}
      className="app"
    >
      {/*todo: rename to Header*/}
      <Sidebar />

      {/*todo: how to name this component?*/}
      <>
        <div className="foo">
          <button
            onClick={() =>
              dispatch({
                type: TOGGLE_FILTERS_OPENED,
                payload: true,
              })
            }
            className="btn"
          >
            filters
          </button>

          <button
            onClick={() =>
              dispatch({
                type: TOGGLE_TAGS_OPENED,
                payload: true,
              })
            }
            className="btn"
          >
            tags
          </button>

          <button
            onClick={() =>
              dispatch({
                type: TOGGLE_CUSTOMIZATION_COLUMNS_OPENED,
                payload: true,
              })
            }
            className="btn"
          >
            customize columns
          </button>
        </div>

        <Drawer
          isOpen={filtersOpened}
          onClose={() =>
            dispatch({
              type: TOGGLE_FILTERS_OPENED,
              payload: false,
            })
          }
          title="Filters"
          position="left"
          maxSize="320px"
        >
          <Filters />
        </Drawer>

        <Drawer
          isOpen={tagsOpened}
          onClose={() =>
            dispatch({
              type: TOGGLE_TAGS_OPENED,
              payload: false,
            })
          }
          title="Tags"
          position="right"
          maxSize="320px"
        >
          <Tags />
        </Drawer>

        <Drawer
          isOpen={customizationColumnsOpened}
          onClose={() =>
            dispatch({
              type: TOGGLE_CUSTOMIZATION_COLUMNS_OPENED,
              payload: false,
            })
          }
          title="Customize columns"
          position="right"
          maxSize="320px"
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
