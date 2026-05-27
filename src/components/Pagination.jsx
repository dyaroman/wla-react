import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  currentPageUpdated,
  perPageUpdated,
} from '../features/table/table.slice';
import { PER_PAGE_VALUES } from '../misc/misc.constants';
import { useIsMobile } from '../hooks/useIsMobile';

export function Pagination({ position }) {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state['table'].currentPage);
  const perPage = useSelector((state) => state['table'].perPage);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const totalPages = Math.ceil(preparedData.length / perPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      changeCurrentPage(totalPages);
    }
  }, [totalPages]);

  function onPerPageChange(event) {
    dispatch(perPageUpdated(Number(event.target.value)));
  }

  function changeCurrentPage(value) {
    dispatch(currentPageUpdated(value));
  }

  if (!isMobile && position === 'below') {
    return null;
  }

  return (
    <div className="container">
      <div className="pagination">
        <div className="pagination__per-page">
          Rows per page:
          <div className="select-wrapper">
            <select
              name="perPage"
              data-qa="perPage"
              value={perPage}
              onChange={onPerPageChange}
              className="select"
            >
              {PER_PAGE_VALUES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className="pagination__buttons"
          role="navigation"
          aria-label="pagination"
        >
          <button
            onClick={() => changeCurrentPage(1)}
            disabled={currentPage === 1}
            className="btn btn--small"
            aria-label="first page"
            data-qa="firstPage"
          >
            {'<<'}
          </button>
          <button
            onClick={() => changeCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn--small"
            aria-label="previous page"
            data-qa="prevPage"
          >
            {'<'}
          </button>
          <span aria-live="polite" aria-atomic="true" data-qa="currentPage">
            {currentPage}/{totalPages}
          </span>
          <button
            onClick={() =>
              changeCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="btn btn--small"
            aria-label="next page"
            data-qa="nextPage"
          >
            {'>'}
          </button>
          <button
            onClick={() => changeCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="btn btn--small"
            aria-label="last page"
            data-qa="lastPage"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}
