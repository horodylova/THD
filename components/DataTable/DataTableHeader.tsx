import React from 'react';
import Link from 'next/link';

export default function DataTableHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Data Table</h2>
      <Link
        href="/new"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 inline-block"
      >
        Add New
      </Link>
    </div>
  );
}
