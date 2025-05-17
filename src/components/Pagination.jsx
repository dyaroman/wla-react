import { useDispatch, useSelector } from 'react-redux';

import {
  CURRENT_PAGE_UPDATED,
  PER_PAGE_UPDATED,
} from '../features/table/table.constants';
import { PER_PAGE_VALUES } from '../misc/misc.constants';
import { useEffect, useState } from 'react';

export function Pagination({ position }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state['table'].currentPage);
  const perPage = useSelector((state) => state['table'].perPage);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const totalPages = Math.ceil(preparedData.length / perPage);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 576);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onPerPageChange(event) {
    dispatch({
      type: PER_PAGE_UPDATED,
      payload: Number(event.target.value),
    });
  }

  function onCurrentPageChange(value) {
    dispatch({
      type: CURRENT_PAGE_UPDATED,
      payload: value,
    });
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
            className="btn"
            aria-label="first page"
            data-qa="firstPage"
          >
            {'<<'}
          </button>
          <button
            onClick={() => changeCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="btn"
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
            className="btn"
            aria-label="next page"
            data-qa="nextPage"
          >
            {'>'}
          </button>
          <button
            onClick={() => changeCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="btn"
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
