import React from 'react';

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  onExport: () => void;
  onDeleteSelected: () => void;
  hasSelected: boolean;
}

export default function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  itemsPerPage,
  totalItems,
  onExport,
  onDeleteSelected,
  hasSelected,
}: DataTablePaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      }

      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

     
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="px-6 py-3 border-t border-gray-200 bg-gray-50/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {totalItems === 0 ? 0 : Math.min(startIndex + 1, totalItems)}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-900">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900">{totalItems}</span> results
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onExport}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 active:scale-95" 
            title="Export"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          </button>
          <button 
            onClick={onDeleteSelected}
            disabled={!hasSelected}
            className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${
              hasSelected 
                ? 'text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Delete Selected"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
        <nav className="flex gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 transition-all duration-200 active:scale-95"
          >
            Previous
          </button>
          <div className="flex gap-1 px-2">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 font-medium"
                  >
                    ...
                  </span>
                );
              }
              
              const pageNum = page as number;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 ${
                    currentPage === pageNum
                      ? 'text-white bg-indigo-600 shadow-md shadow-indigo-200'
                      : 'text-gray-700 bg-white border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 transition-all duration-200 active:scale-95"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
