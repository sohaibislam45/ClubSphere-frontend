const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Results count */}
      <p className="text-sm text-text-muted dark:text-text-secondary">
        Showing <span className="font-bold text-gray-900 dark:text-white">{startItem}</span> to{' '}
        <span className="font-bold text-gray-900 dark:text-white">{endItem}</span> of{' '}
        <span className="font-bold text-gray-900 dark:text-white">{totalItems}</span> results
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#29382f] hover:border-primary dark:hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-surface-dark disabled:hover:border-gray-200 dark:disabled:hover:border-border-dark transition-colors"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-text-muted dark:text-text-secondary">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-primary text-[#111714] border border-primary'
                  : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#29382f] hover:border-primary dark:hover:border-primary'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#29382f] hover:border-primary dark:hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-surface-dark disabled:hover:border-gray-200 dark:disabled:hover:border-border-dark transition-colors"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;

