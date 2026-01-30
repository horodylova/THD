import React from 'react';

export default function DataTableHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0 relative group">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Data Table
        </span>
        <span className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
      </h2>
    </div>
  );
}
