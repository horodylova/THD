import React from 'react';
import { DataItem } from '@/types';

interface DataTableContentProps {
  data: DataItem[];
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  selectedRowIds: Set<number>;
  onToggleRow: (id: number) => void;
  onSelectAll: (checked: boolean) => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function DataTableContent({
  data,
  startIndex,
  itemsPerPage,
  totalItems,
  selectedRowIds,
  onToggleRow,
  onSelectAll,
  onDeleteSelected,
  onExport,
  isSidebarOpen,
  onToggleSidebar,
}: DataTableContentProps) {
  const years = Array.from({ length: 2024 - 2007 + 1 }, (_, i) => 2007 + i);

  const allSelected = data.length > 0 && data.every(item => selectedRowIds.has(item.id));
  const someSelected = data.some(item => selectedRowIds.has(item.id));

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Table Stats */}
      <div className="flex-none px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={onToggleSidebar}
                className="hidden md:block p-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200"
                title="Show Filters"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            )}
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{Math.min(startIndex + 1, totalItems)}</span> to{' '}
              <span className="font-semibold text-gray-900">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{' '}
              of <span className="font-semibold text-gray-900">{totalItems}</span> results
            </p>
          </div>
          <div className="flex gap-2">
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
              disabled={!someSelected}
              className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${
                someSelected 
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
        </div>
      </div>

      {/* Responsive Table */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left sticky top-0 left-0 z-50 bg-gray-50 w-[64px] min-w-[64px]">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-colors cursor-pointer" 
                />
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px] sticky top-0 left-[64px] bg-gray-50 z-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Description
              </th>
              {years.map((year) => (
                <th key={year} scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap sticky top-0 bg-gray-50 z-40">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50 transition-colors duration-150 group">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white group-hover:bg-indigo-50 z-10 transition-colors duration-150">
                    <input 
                      type="checkbox" 
                      checked={selectedRowIds.has(item.id)}
                      onChange={() => onToggleRow(item.id)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-colors cursor-pointer" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap sticky left-[64px] bg-white group-hover:bg-indigo-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors duration-150">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                      {item.cocNumber}, {item.measure}
                    </div>
                  </td>
                  {years.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group-hover:text-gray-700">
                      {item[year.toString()] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={years.length + 2} className="px-6 py-12 text-center text-gray-500 bg-gray-50/20">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-lg font-medium text-gray-900">No data found</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters to see results.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
