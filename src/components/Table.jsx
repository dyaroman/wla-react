import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterTitle } from './FilterTitle';
import { Tags } from './Tags';
import { Highlight } from './Highlight';
import { Cell } from './Cell';
import { ColorCell } from './ColorCell';
import { TableControls } from './TableControls';
import { ImgCell } from './ImgCell';
import { updateTableData } from '../features/table/table.actions';
import { updateURL } from '../features/app/app.actions';
import {
  convertUrlToEnv,
  fromCamelCaseToWords,
  getQueryParamValue,
  triggerGtmEvent,
} from '../misc/functions';
import { NO_DATA, WEBSITES_DATA_FILENAME } from '../misc/misc.constants';
import { FILTERS_UPDATED } from '../features/table/table.constants';
import { TOGGLE_FILTERS_OPEN } from '../features/app/app.constants';
import { TABLE_CELL_SEARCH } from '../misc/gtm.constants';
import { TAGS } from '../misc/url.constants';

export function Table() {
  const dispatch = useDispatch();
  const filtersOpen = useSelector((state) => state['app'].filtersOpen);
  const sort = useSelector((state) => state['table'].sort);
  const filters = useSelector((state) => state['table'].filters);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const showColumns = useSelector((state) => state['table'].showColumns);
  const websitesData = useSelector((state) => state['table'].websitesData);
  const { env, project, columns } = websitesData;
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

  function onTableBodyClick(event) {
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
        dispatch({
          type: TOGGLE_FILTERS_OPEN,
          payload: true,
        });
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
                {showColumns.map((column) => (
                  <FilterTitle
                    key={column}
                    text={fromCamelCaseToWords(column)}
                    column={column}
                  />
                ))}
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
                          let color;
                          switch (column) {
                            case 'mainFormTheme':
                              color = websiteData['mainFormPrimaryColor'];
                              break;
                            case 'altFormTheme':
                              color = websiteData['altFormPrimaryColor'];
                              break;
                            case 'mainFormEsTheme':
                              color = websiteData['mainFormEsPrimaryColor'];
                              break;
                          }
                          return (
                            <ColorCell
                              key={column}
                              column={column}
                              color={color}
                            >
                              <Highlight
                                text={websiteData[column]}
                                highlight={filters[column]}
                              />
                            </ColorCell>
                          );
                        }

                        case TAGS:
                          return (
                            <td
                              data-title={fromCamelCaseToWords(TAGS)}
                              data-qa="tags"
                              key={column}
                            >
                              {websiteData.tags.length ? (
                                <Tags items={websiteData.tags} />
                              ) : (
                                NO_DATA
                              )}
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
