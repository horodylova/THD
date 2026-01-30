'use client';

import React, { useState } from 'react';
import DataTableHeader from './DataTableHeader';
import DataTableFilters from './DataTableFilters';
import DataTableContent from './DataTableContent';
import DataTablePagination from './DataTablePagination';
import { DataItem, FilterState } from '@/types';

export default function DataTable() {
  const [filters, setFilters] = useState<FilterState>({
    measure: '',
    state: '',
    cocNumber: '',
  });

  // State for applied filters (used for data filtering)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    measure: '',
    state: '',
    cocNumber: '',
  });

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Initial empty data
  const [data] = useState<DataItem[]>([]);

  const getFilteredData = () => {
    return data.filter((item) => {
      const matchesMeasure = !appliedFilters.measure || item.name === appliedFilters.measure;

      const matchesState = !appliedFilters.state || item.state === appliedFilters.state;
      const matchesCoC = !appliedFilters.cocNumber || item.cocNumber === appliedFilters.cocNumber;

      return matchesMeasure && matchesState && matchesCoC;
    });
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      measure: '',
      state: '',
      cocNumber: '',
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
      <div className="py-8">
        <DataTableHeader />
        <DataTableFilters
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
        />
        <DataTableContent
          data={paginatedData}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
        />
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
