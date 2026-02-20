interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        {/* First */}
        <li
          className={`page-item first ${currentPage === 1 ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(1)}
            aria-label="First"
          >
            <i className="icon-base ti tabler-chevrons-left icon-sm" />
          </button>
        </li>

        {/* Prev */}
        <li className={`page-item prev ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous"
          >
            <i className="icon-base ti tabler-chevron-left icon-sm" />
          </button>
        </li>

        {/* Page numbers */}
        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        {/* Next */}
        <li
          className={`page-item next ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next"
          >
            <i className="icon-base ti tabler-chevron-right icon-sm" />
          </button>
        </li>

        {/* Last */}
        <li
          className={`page-item last ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
            aria-label="Last"
          >
            <i className="icon-base ti tabler-chevrons-right icon-sm" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
