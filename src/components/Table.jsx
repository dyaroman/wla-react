import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ColumnTitle } from './ColumnTitle';
import { Checkbox } from './Checkbox';
import { Pagination } from './Pagination';
import { ColorCell } from './cells/ColorCell';
import { ImgCell } from './cells/ImgCell';
import { FormsCell } from './cells/FormsCell';
import { WebsiteCell } from './cells/WebsiteCell';
import { RedirectCell } from './cells/RedirectCell';
import { PagesCell } from './cells/PagesCell';
import { FaviconCell } from './cells/FaviconCell';
import { TagsCell } from './cells/TagsCell';
import { DefaultCell } from './cells/DefaultCell';
import { Highlight } from './Highlight';
import {
  checkForUpdates,
  filterAndSortTable,
  updateURL,
} from '../features/table/table.actions';
import {
  convertUrlToEnv,
  fromCamelCaseToWords,
  getQueryParamValue,
  triggerGtmEvent,
} from '../misc/functions';
import { openDrawer } from '../features/drawer/drawer.slice';
import { rgb2hex } from '../misc/color';
import { gtmEvents } from '../misc/gtm.constants';
import { NO_DATA, WEBSITES_DATA_FILENAME } from '../misc/misc.constants';
import { checkboxToggled, filtersUpdated } from '../features/table/table.slice';
import { COLUMNS } from '../misc/columns.constants';
import { FILTERS } from '../features/drawer/drawer.constants';

export function Table() {
  const dispatch = useDispatch();
  const sort = useSelector((state) => state['table'].sort);
  const filters = useSelector((state) => state['table'].filters);
  const tags = useSelector((state) => state['table'].tags);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const showColumns = useSelector((state) => state['table'].showColumns);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const currentPage = useSelector((state) => state['table'].currentPage);
  const perPage = useSelector((state) => state['table'].perPage);
  const checkboxes = useSelector((state) => state['table'].checkboxes);
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = preparedData.slice(indexOfFirstItem, indexOfLastItem);
  const env = websitesData['env'];
  const columns = websitesData['columns'];
  const convertLinksTo =
    getQueryParamValue('convertLinksTo') || getQueryParamValue('clt');
  const convertLinks = convertLinksTo && convertLinksTo !== env;

  useEffect(() => {
    document.addEventListener('visibilitychange', visibilityChangeHandler);

    const minTimeBeforeRequest = 10 * 60_000;
    let inactivityTime = 0;

    function visibilityChangeHandler() {
      if (document.hidden) {
        inactivityTime = Date.now();
      } else {
        const currentTime = Date.now();
        const timeSinceLastVisit = currentTime - inactivityTime;

        if (timeSinceLastVisit >= minTimeBeforeRequest) {
          inactivityTime = currentTime;
          dispatch(checkForUpdates());
        }
      }
    }

    return () => {
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
    };
  }, []);

  useEffect(() => {
    dispatch(filterAndSortTable());
  }, [filters, tags, sort]);

  useEffect(() => {
    dispatch(updateURL());
  }, [filters, tags, sort, showColumns, perPage, currentPage]);

  function onTableBodyClick(event) {
    searchCell(event);
    copyCellText(event);
  }

  function onCheckboxChange(index) {
    dispatch(checkboxToggled(index));
  }

  function searchCell(event) {
    if (!event.altKey) return;

    const cell = event.target.closest('td,th');
    if (!cell) return;

    const filterName = cell && cell.dataset.qa;
    if (!filterName) return;

    for (const col of columns) {
      if (!col.renderFilter) continue;

      if (filterName !== col.name) continue;

      dispatch(openDrawer(FILTERS));

      setTimeout(() => {
        const filter = document.querySelector(
          `.filters input[data-qa='${filterName}']`,
        );
        if (!filter) return;

        let filterValue = '';
        if (![COLUMNS.pages, COLUMNS.forms].includes(filterName)) {
          filterValue = cell.innerText.trim();
        }

        dispatch(filtersUpdated({ [filterName]: filterValue }));
        triggerGtmEvent(gtmEvents.tableCellSearch, {
          filter_name: filterName,
          filter_value: filterValue,
        });

        filter.select();
      }, 300);
    }
  }

  async function copyCellText(event) {
    if (!event.metaKey) return;

    const cell = event.target.closest('td,th');
    if (!cell) return;
    // skip list number, tags and ogImage columns
    if (
      ['#', COLUMNS.checkbox, COLUMNS.tags, COLUMNS.ogImage]
        .map((column) => column.toLowerCase())
        .includes(cell.dataset.qa.toLowerCase())
    )
      return;

    const initColor = getComputedStyle(cell).color;
    const initBgColor = getComputedStyle(cell).backgroundColor;

    try {
      cell.style.color = getComputedStyle(
        document.querySelector('body'),
      ).getPropertyValue('--body-color');
      cell.style.backgroundColor = getComputedStyle(
        document.querySelector('body'),
      ).getPropertyValue('--body-bg');

      let contentToCopy;
      if (cell.dataset.qa.toLowerCase().includes('theme')) {
        contentToCopy =
          initBgColor === 'rgba(0, 0, 0, 0)' ? NO_DATA : rgb2hex(initBgColor);
      } else {
        contentToCopy = cell.innerText;
      }
      await navigator.clipboard.writeText(contentToCopy);
    } catch (e) {
      console.log(`Error due to copy cell text content`, e);
    } finally {
      setTimeout(() => {
        if (
          cell.dataset.qa.toLowerCase().includes('theme') &&
          initBgColor !== 'rgba(0, 0, 0, 0)'
        ) {
          cell.style.color = initColor;
          cell.style.backgroundColor = initBgColor;
        } else {
          cell.style.color = '';
          cell.style.backgroundColor = '';
        }
      }, 300);
    }
  }

  if (websitesData['websites'].length === 0) {
    return (
      <div className="full-height">
        <h4 data-qa="emptyDataFile">
          No data to show. Please check "{WEBSITES_DATA_FILENAME}" file.
        </h4>
      </div>
    );
  } else if (preparedData.length === 0) {
    return (
      <div className="full-height">
        <h4 data-qa="noResults">No data to show, please check your filters.</h4>
      </div>
    );
  } else if (showColumns.length === 0) {
    return (
      <div className="full-height">
        <h4 data-qa="noColumns">
          No columns to show, please check customize columns.
        </h4>
      </div>
    );
  } else {
    return (
      <>
        <Pagination position="above" />
        <section className="table">
          <table>
            <thead>
              <tr>
                {showColumns.map((column) => {
                  switch (column) {
                    case COLUMNS.index:
                      return (
                        <th key={column} data-qa={column} className="narrow">
                          #
                        </th>
                      );

                    case COLUMNS.checkbox:
                      return (
                        <th key={column} data-qa={column} className="narrow" />
                      );

                    default:
                      return (
                        <ColumnTitle
                          key={column}
                          text={column}
                          column={column}
                        />
                      );
                  }
                })}
              </tr>
            </thead>

            <tbody onClick={onTableBodyClick}>
              {currentItems.map((websiteData) => {
                const host =
                  (convertLinks &&
                    convertUrlToEnv(
                      websiteData[COLUMNS.website],
                      convertLinksTo,
                    )) ||
                  websiteData[COLUMNS.host];
                const websiteIndex = preparedData.indexOf(websiteData) + 1;

                return (
                  <tr key={websiteData[COLUMNS.website]}>
                    {showColumns.map((column) => {
                      switch (column) {
                        case COLUMNS.index:
                          return (
                            <td
                              data-title={fromCamelCaseToWords(column)}
                              data-qa={column}
                              key={column}
                            >
                              {websiteIndex}
                            </td>
                          );

                        case COLUMNS.checkbox:
                          return (
                            <td
                              data-title={fromCamelCaseToWords(column)}
                              data-qa={column}
                              key={column}
                            >
                              <Checkbox
                                name={''}
                                label={''}
                                checked={checkboxes.includes(websiteIndex)}
                                onChange={() => onCheckboxChange(websiteIndex)}
                              />
                            </td>
                          );

                        case COLUMNS.website:
                          return (
                            <WebsiteCell
                              key={column}
                              column={column}
                              websiteData={websiteData}
                              host={host}
                              filters={filters}
                            />
                          );

                        case COLUMNS.ocsDefaultRedirect:
                        case COLUMNS.rootRedirect:
                          return (
                            <RedirectCell
                              key={column}
                              column={column}
                              websiteData={websiteData}
                              filters={filters}
                            />
                          );

                        case COLUMNS.ogImage: {
                          const images = websiteData[column].map(
                            (path) => `https://${host}/${path}`,
                          );
                          return (
                            <td
                              data-title={fromCamelCaseToWords(column)}
                              data-qa={column}
                              key={column}
                            >
                              {images.length ? (
                                <ImgCell sources={images} />
                              ) : (
                                NO_DATA
                              )}
                            </td>
                          );
                        }

                        case COLUMNS.favicon:
                          return (
                            <FaviconCell
                              key={column}
                              column={column}
                              websiteData={websiteData}
                              host={host}
                            />
                          );

                        case COLUMNS.mainFormTheme:
                        case COLUMNS.altFormTheme:
                        case COLUMNS.mainFormEsTheme: {
                          const bgColorKey = {
                            [COLUMNS.mainFormTheme]:
                              COLUMNS.mainFormPrimaryColor,
                            [COLUMNS.altFormTheme]: COLUMNS.altFormPrimaryColor,
                            [COLUMNS.mainFormEsTheme]:
                              COLUMNS.mainFormEsPrimaryColor,
                          }[column];
                          return (
                            <ColorCell
                              key={column}
                              column={column}
                              bgColor={websiteData[bgColorKey]}
                            >
                              <Highlight
                                text={websiteData[column]}
                                highlight={filters[column]}
                              />
                            </ColorCell>
                          );
                        }

                        case COLUMNS.pages:
                          return (
                            <PagesCell
                              key={column}
                              column={column}
                              websiteData={websiteData}
                              host={host}
                              filters={filters}
                            />
                          );

                        case COLUMNS.forms: {
                          const forms = Object.keys(websiteData[column]);
                          return (
                            <td
                              data-title={fromCamelCaseToWords(column)}
                              data-qa={column}
                              key={column}
                            >
                              {forms.length ? (
                                <FormsCell
                                  forms={websiteData[column]}
                                  filter={filters[column]}
                                  host={host}
                                />
                              ) : (
                                NO_DATA
                              )}
                            </td>
                          );
                        }

                        case COLUMNS.tags:
                          return (
                            <TagsCell
                              key={column}
                              column={column}
                              websiteData={websiteData}
                            />
                          );

                        default:
                          return (
                            <DefaultCell
                              key={column}
                              column={column}
                              websiteData={websiteData}
                              filters={filters}
                            />
                          );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <Pagination position="below" />
      </>
    );
  }
}
