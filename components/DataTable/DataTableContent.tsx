import React, { useEffect, useRef } from 'react';
import { DataItem } from '@/types';

interface DataTableContentProps {
  data: DataItem[];
  selectedRowIds: Set<number>;
  onToggleRow: (id: number) => void;
  onSelectAll: (checked: boolean) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function DataTableContent({
  data,
  selectedRowIds,
  onToggleRow,
  onSelectAll,
  isSidebarOpen,
  onToggleSidebar,
}: DataTableContentProps) {
  const years = Array.from({ length: 2024 - 2007 + 1 }, (_, i) => 2007 + i);

  const allSelected = data.length > 0 && data.every(item => selectedRowIds.has(item.id));
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [data.length]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col relative">
      {!isSidebarOpen && (
        <button 
          onClick={onToggleSidebar}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 absolute top-3 left-3 z-[60]"
          title="Show Filters"
        >
          <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
          <span className="text-xs font-medium">Filters</span>
        </button>
      )}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto custom-scrollbar relative">
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
                  <td className="px-6 py-4 sticky left-[64px] bg-white group-hover:bg-indigo-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors duration-150">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors whitespace-normal max-w-[300px]">
                      {item.cocNumber}, {item.state}, {item.measure}
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
                <td colSpan={years.length + 2} className="px-6 py-12 text-left text-gray-500 bg-gray-50/20">
                  <div className="flex flex-col items-start justify-center">
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
