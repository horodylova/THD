'use client';

import React, { useState } from 'react';
import DataTableHeader from './DataTableHeader';
import DataTableFilters from './DataTableFilters';
import DataTableContent from './DataTableContent';
import DataTablePagination from './DataTablePagination';
import { DataItem, FilterState } from '@/types';
import { generatePDF } from '@/lib/pdfExport';

interface DataTableProps {
  initialData?: DataItem[];
}

export default function DataTable({ initialData = [] }: DataTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    measure: '',
    state: '',
    cocNumber: '',
  });
 

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

 
  const [data] = useState<DataItem[]>(initialData);
  const [displayedData, setDisplayedData] = useState<DataItem[]>(initialData);
  const [isCustomView, setIsCustomView] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());

  const toggleRowSelection = (id: number) => {
    setSelectedRowIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    setDisplayedData(prev => prev.filter(item => !selectedRowIds.has(item.id)));
    setSelectedRowIds(new Set());
    
  
    const remainingItems = displayedData.filter(item => !selectedRowIds.has(item.id));
    const maxPage = Math.ceil(remainingItems.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (maxPage === 0) {
      setCurrentPage(1);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all visible items on the current page
      const newSelected = new Set(selectedRowIds);
      paginatedData.forEach(item => newSelected.add(item.id));
      setSelectedRowIds(newSelected);
    } else {
      // Deselect all visible items on the current page
      const newSelected = new Set(selectedRowIds);
      paginatedData.forEach(item => newSelected.delete(item.id));
      setSelectedRowIds(newSelected);
    }
  };
 
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

  
  const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = displayedData.slice(startIndex, startIndex + itemsPerPage);

  const handleApplyFilters = () => {
    const newItems = data.filter((item) => {
      const matchesMeasure = !filters.measure || item.measure === filters.measure;
      const matchesState = !filters.state || item.state === filters.state;
      const matchesCoC = !filters.cocNumber || item.cocNumber === filters.cocNumber;
      return matchesMeasure && matchesState && matchesCoC;
    });

    setDisplayedData((prev) => {
  
      if (!isCustomView) {
        return newItems;
      }
   
      const existingIds = new Set(prev.map(item => item.id));
      const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
      return [...prev, ...uniqueNewItems];
    });
    
    setIsCustomView(true);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      measure: '',
      state: '',
      cocNumber: '',
    };
    setFilters(emptyFilters);
    setDisplayedData(initialData);
    setIsCustomView(false);
    setCurrentPage(1);
  };

  const handleExport = () => {
    generatePDF(displayedData);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col gap-6">
      <div className="flex-none">
        <DataTableHeader />
        <DataTableFilters
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
          availableStates={uniqueStates}
          availableCoCs={availableCoCs}
          cocName={selectedCoC ? selectedCoC.name : ''}
          cocCategory={selectedCoC ? selectedCoC.category : ''}
        />
      </div>

      <div className="flex-1 min-h-0">
        <DataTableContent
          data={paginatedData}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          totalItems={displayedData.length}
          selectedRowIds={selectedRowIds}
          onToggleRow={toggleRowSelection}
          onSelectAll={handleSelectAll}
          onDeleteSelected={handleDeleteSelected}
          onExport={handleExport}
        />
      </div>

      <div className="flex-none">
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
