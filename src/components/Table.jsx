import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterTitle } from './FilterTitle';
import { Tags } from './Tags';
import { Highlight } from './Highlight';
import { Cell } from './Cell';
import { ColorCell } from './ColorCell';
import { TableControls } from './TableControls';
import { ImgCell } from './ImgCell';
import { Checkbox } from './Checkbox';
import { updateTableData } from '../features/table/table.actions';
import { toggleFiltersOpen, updateURL } from '../features/app/app.actions';
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
import { CHECKBOX, TAGS_COLUMN } from '../misc/columns.constants';

export function Table() {
  const dispatch = useDispatch();
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
      if (!filtersOpen) {
        dispatch(toggleFiltersOpen(true));
      }
      const fieldValue = cell.innerText.trim();
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
      ['#', CHECKBOX, TAGS_COLUMN, 'ogImage']
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
      <h4>No data to show. Please check "{WEBSITES_DATA_FILENAME}" file.</h4>
    );
  } else if (preparedData.length === 0) {
    return (
      <h4 data-qa="noResults">No data to show, please check your filters.</h4>
    );
  } else {
    return (
      <>
        <TableControls />
        <section className="table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                {showColumns.map((column) => {
                  const title =
                    column === CHECKBOX ? '' : fromCamelCaseToWords(column);
                  return (
                    <FilterTitle key={column} text={title} column={column} />
                  );
                })}
              </tr>
            </thead>

            <tbody onClick={onTableBodyClick}>
              {preparedData.map((websiteData, index) => {
                const host =
                  (convertLinks &&
                    convertUrlToEnv(
                      websiteData['website'],
                      convertLinksTo,
                      project,
                    )) ||
                  websiteData['host'];
                return (
                  <tr key={websiteData['website']}>
                    <td data-title="#" data-qa="#">
                      {++index}
                    </td>
                    {showColumns.map((column) => {
                      switch (column) {
                        case 'website':
                          return (
                            <th
                              data-title={fromCamelCaseToWords('website')}
                              data-qa="website"
                              key={column}
                            >
                              <a
                                href={`https://${host}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Highlight
                                  text={websiteData['website']}
                                  highlight={filters['website']}
                                />
                              </a>
                            </th>
                          );

                        case 'ogImage': {
                          const images = websiteData['ogImage'].map(
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

                        case 'mainFormTheme':
                        case 'altFormTheme':
                        case 'mainFormEsTheme': {
                          let bgColor;
                          switch (column) {
                            case 'mainFormTheme':
                              bgColor = websiteData['mainFormPrimaryColor'];
                              break;
                            case 'altFormTheme':
                              bgColor = websiteData['altFormPrimaryColor'];
                              break;
                            case 'mainFormEsTheme':
                              bgColor = websiteData['mainFormEsPrimaryColor'];
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

                        case 'pages':
                          return (
                            <td
                              data-title={fromCamelCaseToWords(column)}
                              data-qa={column}
                              key={column}
                            >
                              {websiteData['pages'].length ? (
                                <ul>
                                  {websiteData['pages'].map((page) => (
                                    <li key={page}>
                                      <Highlight
                                        text={page}
                                        highlight={filters[column]}
                                      />
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                NO_DATA
                              )}
                            </td>
                          );

                        case TAGS_COLUMN:
                          return (
                            <td
                              data-title={fromCamelCaseToWords(column)}
                              data-qa={column}
                              key={column}
                            >
                              {websiteData.tags.length ? (
                                <Tags items={websiteData.tags} />
                              ) : (
                                NO_DATA
                              )}
                            </td>
                          );

                        case CHECKBOX:
                          return (
                            <td
                              data-qa={column}
                              data-title={fromCamelCaseToWords(column)}
                              key={column}
                            >
                              <Checkbox label={''} />
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
      </>
    );
  }
}
