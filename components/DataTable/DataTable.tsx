'use client';

import React, { useState } from 'react';
import DataTableHeader from './DataTableHeader';
import DataTableFilters from './DataTableFilters';
import DataTableContent from './DataTableContent';
import DataTablePagination from './DataTablePagination';
import { DataItem, FilterState } from '@/types';

export default function DataTable() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    category: '',
    date: '',
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data - replace with your data source
  const [data] = useState<DataItem[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'active',
      category: 'tech',
      date: '2024-01-15',
      initials: 'JD',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      status: 'pending',
      category: 'business',
      date: '2024-01-20',
      initials: 'JS',
    },
    // Add more sample data here if needed
  ]);

  const getFilteredData = () => {
    return data.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesCategory = !filters.category || item.category === filters.category;
      const matchesDate = !filters.date || item.date >= filters.date;

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      date: '',
    });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
      <div className="py-8">
        <DataTableHeader />
        <DataTableFilters
          filters={filters}
          setFilters={setFilters}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          onReset={handleResetFilters}
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
