import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterTitle } from './FilterTitle';
import { Tags } from './Tags';
import { Highlight } from './Highlight';
import { updateTableData } from '../features/table/table.actions';
import { fromCamelCaseToWords, updateURL } from '../misc/functions';
import { WEBSITES_DATA_FILENAME } from '../misc/constants';

export function Table() {
  const dispatch = useDispatch();
  const { sort, filters, preparedData, websitesData } = useSelector(
    (state) => state['table']
  );
  const { columns } = websitesData;

  useEffect(() => {
    dispatch(updateTableData());
    updateURL({
      ...filters,
      ...sort,
    });
  }, [dispatch, filters, sort]);

  let content;

  if (websitesData.websites.length === 0) {
    content = (
      <h4>No data to show. Please check "{WEBSITES_DATA_FILENAME}" file.</h4>
    );
  } else if (preparedData.length === 0) {
    return (
      <h4 data-qa="badFilters">No data to show, please change your filters.</h4>
    );
  } else {
    content = (
      <table>
        <thead>
          <tr>
            <th>#</th>
            {columns.map((column) => (
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
              <th
                data-title={fromCamelCaseToWords('website')}
                data-qa="website"
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
              {columns
                .filter((e) => ['website', 'tags'].includes(e) === false)
                .map((column) => (
                  <td
                    data-title={fromCamelCaseToWords(column)}
                    data-qa={column}
                    key={column}
                  >
                    <Highlight
                      text={websiteData[column]}
                      highlight={filters[column]}
                    />
                  </td>
                ))}
              <td data-title={fromCamelCaseToWords('tags')} data-qa="tags">
                <Tags items={websiteData.tags} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return <section className="table">{content}</section>;
}
