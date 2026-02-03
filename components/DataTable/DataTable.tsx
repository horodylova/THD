'use client';

import React, { useState } from 'react';
import DataTableHeader from './DataTableHeader';
import DataTableFilters from './DataTableFilters';
import DataTableContent from './DataTableContent';
import DataTablePagination from './DataTablePagination';
import { DataItem, FilterState } from '@/types';

interface DataTableProps {
  initialData?: DataItem[];
}

export default function DataTable({ initialData = [] }: DataTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    measure: '',
    state: '',
    cocNumber: '',
  });
 
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    measure: '',
    state: '',
    cocNumber: '',
  });

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

 
  const [data] = useState<DataItem[]>(initialData);
 
  const uniqueStates = React.useMemo(() => {
    const states = new Set(data.map(item => item.state));
    return Array.from(states).filter(Boolean).sort();
  }, [data]);

  const availableCoCs = React.useMemo(() => {
    if (!filters.state) return [];
    const cocs = new Set(
      data
        .filter(item => item.state === filters.state)
        .map(item => item.cocNumber)
    );
    return Array.from(cocs).filter(Boolean).sort();
  }, [data, filters.state]);

  
  const selectedCoC = React.useMemo(() => {
    if (!filters.cocNumber) return { name: '', category: '' };
    const item = data.find(d => d.cocNumber === filters.cocNumber);
    return item ? { name: item.name, category: item.cocCategory } : { name: '', category: '' };
  }, [data, filters.cocNumber]);

  const getFilteredData = () => {
    return data.filter((item) => {
      const matchesMeasure = !appliedFilters.measure || item.measure === appliedFilters.measure; // Fixed: check against item.measure

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
          availableStates={uniqueStates}
          availableCoCs={availableCoCs}
          cocName={selectedCoC.name}
          cocCategory={selectedCoC.category}
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
