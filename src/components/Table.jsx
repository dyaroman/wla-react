import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterTitle } from './FilterTitle';
import { TagsList } from './TagsList';
import { Highlight } from './Highlight';
import { Cell } from './Cell';
import { ColorCell } from './ColorCell';
import { ImgCell } from './ImgCell';
import { Checkbox } from './Checkbox';
import { updateTableData } from '../features/table/table.actions';
import {
  toggleFiltersOpen,
  toggleSidebarOpen,
  updateURL,
} from '../features/app/app.actions';
import {
  convertUrlToEnv,
  fromCamelCaseToWords,
  getQueryParamValue,
  triggerGtmEvent,
} from '../misc/functions';
import { rgb2hex } from '../misc/color';
import { NO_DATA, WEBSITES_DATA_FILENAME } from '../misc/misc.constants';
import { FILTERS_UPDATED } from '../features/table/table.constants';
import { TABLE_CELL_SEARCH } from '../misc/gtm.constants';
import { COLUMNS } from '../misc/columns.constants';

export function Table() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state['app'].sidebarOpen);
  const filtersOpen = useSelector((state) => state['app'].filtersOpen);
  const sort = useSelector((state) => state['table'].sort);
  const filters = useSelector((state) => state['table'].filters);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const showColumns = useSelector((state) => state['table'].showColumns);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const env = websitesData['env'];
  const project = websitesData['project'];
  const columns = websitesData['columns'];
  const convertLinksTo =
    getQueryParamValue('convertLinksTo') || getQueryParamValue('clt');
  const convertLinks = convertLinksTo && convertLinksTo !== env;

  useEffect(() => {
    dispatch(updateTableData());
  }, [filters, sort]);

  useEffect(() => {
    dispatch(
      updateURL({
        ...filters,
        ...sort,
        showColumns,
      }),
    );
  }, [filters, sort, showColumns]);

  function onTableBodyClick() {
    searchCell();
    copyCellText();
  }

  function searchCell() {
    if (!event.altKey) return;

    const cell = event.target.closest('td,th');
    if (!cell) return;

    const fieldName = cell && cell.dataset.qa;
    if (!fieldName) return;

    for (const column in columns) {
      if (!columns[column]['renderFilter']) continue;

      if (fieldName !== column) continue;

      const field = document.querySelector(
        `.filters input[data-qa='${fieldName}']`,
      );
      if (!field) return;

      if (!sidebarOpen) {
        dispatch(toggleSidebarOpen(true));
      }
      if (!filtersOpen) {
        dispatch(toggleFiltersOpen(true));
      }

      let fieldValue = '';
      if (![COLUMNS.pages, COLUMNS.forms].includes(fieldName)) {
        fieldValue = cell.innerText.trim();
      }

      dispatch({
        type: FILTERS_UPDATED,
        payload: {
          [fieldName]: fieldValue,
        },
      });
      triggerGtmEvent(TABLE_CELL_SEARCH, {
        filter_name: fieldName,
        filter_value: fieldValue,
      });
      setTimeout(() => field.select());
    }
  }

  async function copyCellText() {
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
      <div className="container">
        <h4 data-qa="emptyDataFile">
          No data to show. Please check "{WEBSITES_DATA_FILENAME}" file.
        </h4>
      </div>
    );
  } else if (preparedData.length === 0) {
    return (
      <div className="container">
        <h4 data-qa="noResults">No data to show, please check your filters.</h4>
      </div>
    );
  } else if (showColumns.length === 0) {
    return (
      <div className="container">
        <h4 data-qa="noColumns">
          No columns to show, please check customize columns.
        </h4>
      </div>
    );
  } else {
    return (
      <section className="table">
        <table>
          <thead>
            <tr>
              {showColumns.map((column) => {
                switch (column) {
                  case COLUMNS.index:
                    return (
                      <th key={column} data-qa={column} className="shrink">
                        #
                      </th>
                    );
                  case COLUMNS.checkbox:
                    return (
                      <th key={column} data-qa={column} className="shrink"></th>
                    );

                  default:
                    return (
                      <FilterTitle key={column} text={column} column={column} />
                    );
                }
              })}
            </tr>
          </thead>

          <tbody onClick={onTableBodyClick}>
            {preparedData.map((websiteData, index) => {
              const host =
                (convertLinks &&
                  convertUrlToEnv(
                    websiteData[COLUMNS.website],
                    convertLinksTo,
                    project,
                  )) ||
                websiteData[COLUMNS.host];
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
                            {++index}
                          </td>
                        );

                      case COLUMNS.website:
                        return (
                          <td
                            data-title={fromCamelCaseToWords(column)}
                            data-qa={column}
                            key={column}
                          >
                            <a
                              href={`https://${host}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Highlight
                                text={websiteData[COLUMNS.website]}
                                highlight={filters[COLUMNS.website]}
                              />
                            </a>
                          </td>
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

                      case COLUMNS.favicon: {
                        const image = `https://${host}/${websiteData[column]}`;
                        return (
                          <td
                            data-title={fromCamelCaseToWords(column)}
                            data-qa={column}
                            key={column}
                          >
                            {websiteData[column] === NO_DATA ? (
                              NO_DATA
                            ) : (
                              <ImgCell sources={[image]} />
                            )}
                          </td>
                        );
                      }

                      case COLUMNS.mainFormTheme:
                      case COLUMNS.altFormTheme:
                      case COLUMNS.mainFormEsTheme: {
                        let bgColor;
                        switch (column) {
                          case COLUMNS.mainFormTheme:
                            bgColor = websiteData[COLUMNS.mainFormPrimaryColor];
                            break;
                          case COLUMNS.altFormTheme:
                            bgColor = websiteData[COLUMNS.altFormPrimaryColor];
                            break;
                          case COLUMNS.mainFormEsTheme:
                            bgColor =
                              websiteData[COLUMNS.mainFormEsPrimaryColor];
                            break;
                        }
                        return (
                          <ColorCell
                            key={column}
                            column={column}
                            bgColor={bgColor}
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
                          <td
                            data-title={fromCamelCaseToWords(column)}
                            data-qa={column}
                            key={column}
                          >
                            {websiteData[column].length ? (
                              <ul>
                                {websiteData[column].map((page) => (
                                  <li key={page}>
                                    <a
                                      href={`https://${host}/${page}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Highlight
                                        text={page}
                                        highlight={filters[column]}
                                      />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              NO_DATA
                            )}
                          </td>
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
                              <ul>
                                {forms.map((form) => (
                                  <li key={form}>
                                    <Highlight
                                      text={form}
                                      highlight={filters[column]}
                                    />
                                    <ul>
                                      {websiteData[column][form].map((page) => (
                                        <li key={page}>
                                          <a
                                            href={`https://${host}/${page}`}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            {page}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              NO_DATA
                            )}
                          </td>
                        );
                      }

                      case COLUMNS.tags:
                        return (
                          <td
                            data-title={fromCamelCaseToWords(column)}
                            data-qa={column}
                            key={column}
                          >
                            {websiteData.tags.length ? (
                              <TagsList items={websiteData.tags} />
                            ) : (
                              NO_DATA
                            )}
                          </td>
                        );

                      case COLUMNS.checkbox:
                        return (
                          <td
                            data-title={fromCamelCaseToWords(column)}
                            data-qa={column}
                            key={column}
                          >
                            <Checkbox name={''} label={''} />
                          </td>
                        );

                      default:
                        return (
                          <Cell key={column} column={column}>
                            <Highlight
                              text={websiteData[column]}
                              highlight={filters[column]}
                            />
                          </Cell>
                        );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    );
  }
}
