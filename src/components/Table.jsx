import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterTitle } from './FilterTitle';
import { Tags } from './Tags';
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
                columnName={column}
              />
            ))}
          </tr>
        </thead>

        <tbody>
          {preparedData.length ? (
            preparedData.map((websiteData, index) => {
              return (
                <tr key={websiteData.website}>
                  <td data-title="#" data-qa="#">
                    {index + 1}
                  </td>
                  <th data-title="website" data-qa="website">
                    <a
                      href={`https://${websiteData.host}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {websiteData.website}
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
                        {websiteData[column]}
                      </td>
                    ))}
                  <td data-title="Tags" data-qa="tags">
                    <Tags items={websiteData.tags} />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="100" align="center" style={{ gap: 0 }}>
                no data, please change your filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  return <section className="table">{content}</section>;
}
