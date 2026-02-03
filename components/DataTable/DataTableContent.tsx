import React from 'react';
import { DataItem } from '@/types';

interface DataTableContentProps {
  data: DataItem[];
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
}

export default function DataTableContent({
  data,
  startIndex,
  itemsPerPage,
  totalItems,
}: DataTableContentProps) {
   
  const years = Array.from({ length: 2024 - 2007 + 1 }, (_, i) => 2007 + i);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Table Stats */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{Math.min(startIndex + 1, totalItems)}</span> to{' '}
            <span className="font-semibold text-gray-900">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{' '}
            of <span className="font-semibold text-gray-900">{totalItems}</span> results
          </p>
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 active:scale-95" title="Export">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 active:scale-95" title="Print">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-6 py-4 text-left sticky left-0 z-20 bg-gray-50/95 backdrop-blur-sm w-[64px] min-w-[64px]">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-colors cursor-pointer" />
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px] sticky left-[64px] bg-gray-50/95 backdrop-blur-sm z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Description
              </th>
              {years.map((year) => (
                <th key={year} scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {year}
                </th>
              ))}
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50/95 backdrop-blur-sm z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white group-hover:bg-indigo-50/30 z-10 transition-colors duration-150">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-colors cursor-pointer" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap sticky left-[64px] bg-white group-hover:bg-indigo-50/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors duration-150">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                      {item.cocNumber}, {item.measure}
                    </div>
                  </td>
                  {years.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group-hover:text-gray-700">
                      {item[year.toString()] || '-'}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white group-hover:bg-indigo-50/30 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors duration-150">
                    {/* Empty Actions column for now */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={years.length + 3} className="px-6 py-12 text-center text-gray-500 bg-gray-50/20">
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
