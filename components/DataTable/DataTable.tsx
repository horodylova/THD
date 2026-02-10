'use client';

import React, { useState, useEffect } from 'react';
// import DataTableHeader from './DataTableHeader'; // Removed as requested
import DataTableFilters from './DataTableFilters';
import DataTableContent from './DataTableContent';
import DataTablePagination from './DataTablePagination';
import DataChart from './DataChart';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        // Auto-select if results are few (<= 10)
        if (newItems.length > 0 && newItems.length <= 10) {
          const newIds = new Set(newItems.map(item => item.id));
          setSelectedRowIds(newIds);
        } else {
          setSelectedRowIds(new Set());
        }
        return newItems;
      }
   
      const existingIds = new Set(prev.map(item => item.id));
      const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
      
      // Auto-select newly added items if total is small
      if (uniqueNewItems.length > 0 && (prev.length + uniqueNewItems.length) <= 10) {
        const newIds = new Set(selectedRowIds);
        uniqueNewItems.forEach(item => newIds.add(item.id));
        setSelectedRowIds(newIds);
      }
      
      return [...prev, ...uniqueNewItems];
    });
    
    setIsCustomView(true);
    setCurrentPage(1);
    
    // Auto-collapse sidebar on mobile after applying filters
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
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

  const chartRef = React.useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    let chartImage: string | undefined;
    
    if (chartRef.current && chartData.length > 0) {
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(chartRef.current, {
          scale: 2, // Improve quality
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            const controls = clonedDoc.querySelectorAll('.chart-controls-no-export');
            controls.forEach((el) => {
              (el as HTMLElement).style.display = 'none';
            });
            
            // Hide tooltips and active dots
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              .recharts-tooltip-wrapper { display: none !important; }
              .recharts-active-dot { display: none !important; }
              .recharts-tooltip-cursor { display: none !important; }
            `;
            clonedDoc.head.appendChild(style);
          }
        });
        chartImage = canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Failed to capture chart image:', error);
      }
    }
    
    generatePDF(displayedData, chartImage);
  };

  const chartData = React.useMemo(() => {
    return displayedData.filter(item => selectedRowIds.has(item.id));
  }, [displayedData, selectedRowIds]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div 
        className="md:hidden flex-none bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors z-20"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
          Filters
        </div>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isSidebarOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Sidebar - Filters */}
      <aside className={`
        flex-none bg-white border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 overflow-hidden transition-all duration-300 ease-in-out
        md:h-full md:flex md:flex-col
        ${isSidebarOpen ? 'md:w-80 md:opacity-100' : 'md:w-0 md:opacity-0 md:border-r-0'}
        ${isSidebarOpen ? 'max-h-[80vh] opacity-100 border-b' : 'max-h-0 opacity-0 border-b-0'}
        md:border-b-0 w-full md:max-h-full
      `}>
        <div className="px-6 pb-6 pt-6 md:pt-11 h-full overflow-hidden w-full md:w-80 overflow-y-auto">
          <DataTableFilters
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
            onClose={() => setIsSidebarOpen(false)}
            availableStates={uniqueStates}
            availableCoCs={availableCoCs}
            cocName={selectedCoC ? selectedCoC.name : ''}
            cocCategory={selectedCoC ? selectedCoC.category : ''}
          />
        </div>
      </aside>

      {/* Main Content - Header, Table, Pagination */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative p-4 md:p-8">
        <div className="flex-1 min-h-0 flex flex-col gap-6">
          <div className="flex-1 min-h-0 flex flex-col gap-4 basis-1/2">
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
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen(true)}
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
          
          <div 
            ref={chartRef}
            className="flex-1 min-h-0 basis-1/2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <DataChart data={chartData} />
          </div>
        </div>
      </main>
    </div>
  );
}
