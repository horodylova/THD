import React from 'react';

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: DataTablePaginationProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Page <span className="font-semibold">{currentPage}</span> of{' '}
          <span className="font-semibold">{totalPages || 1}</span>
        </div>
        <nav className="flex gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === pageNum
                    ? 'text-white bg-blue-600 border-blue-600'
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                } border`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
