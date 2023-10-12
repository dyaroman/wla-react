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
import { fromCamelCaseToWords } from '../misc/functions';
import { NO_DATA, WEBSITES_DATA_FILENAME } from '../misc/constants';

export function Table() {
  const dispatch = useDispatch();
  const { sort, filters, preparedData, websitesData, showedColumns } =
    useSelector((state) => state['table']);

  useEffect(() => {
    dispatch(updateTableData());
    dispatch(
      updateURL({
        ...filters,
        ...sort,
      })
    );
  }, [filters, sort]);

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
                {showedColumns.map((column) => (
                  <FilterTitle
                    key={column}
                    text={fromCamelCaseToWords(column)}
                    column={column}
                  />
                ))}
              </tr>
            </thead>

            <tbody>
              {preparedData.map((websiteData, index) => (
                <tr key={websiteData.website}>
                  <td data-title="#" data-qa="#">
                    {index + 1}
                  </td>
                  {showedColumns.map((column) => {
                    switch (column) {
                      case 'website':
                        return (
                          <th
                            data-title={fromCamelCaseToWords('website')}
                            data-qa="website"
                            key={column}
                          >
                            <a
                              href={`https://${websiteData.host}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Highlight
                                text={websiteData.website}
                                highlight={filters.website}
                              />
                            </a>
                          </th>
                        );

                      case 'ogImage': {
                        const images = websiteData['ogImage'].map(
                          (path) => `https://${websiteData.host}/${path}`
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
                          <ColorCell key={column} column={column} color={color}>
                            <Highlight
                              text={websiteData[column]}
                              highlight={filters[column]}
                            />
                          </ColorCell>
                        );
                      }

                      case 'tags':
                        return (
                          <td
                            data-title={fromCamelCaseToWords('tags')}
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
              ))}
            </tbody>
          </table>
        </section>
      </>
    );
  }
}
