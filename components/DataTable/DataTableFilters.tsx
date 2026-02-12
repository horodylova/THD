import React from 'react';
import { FilterState } from '@/types';
import { MEASURES } from '@/constants/measures';
import MultiSelect, { MultiSelectOption } from '../ui/MultiSelect';
import FilterTags from './FilterTags';

interface DataTableFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  onApply: () => void;
  onClose?: () => void;
  availableCoCs: string[];
}

export default function DataTableFilters({
  filters,
  setFilters,
  onReset,
  onApply,
  onClose,
  availableCoCs,
}: DataTableFiltersProps) {

  const handleMeasureChange = (value: string[]) => {
    setFilters((prev) => ({ ...prev, measure: value }));
  };

  const handleCocNumberChange = (value: string[]) => {
    setFilters((prev) => ({ ...prev, cocNumber: value }));
  };

  const measureOptions: MultiSelectOption[] = MEASURES.map(measure => ({ value: measure, label: measure }));

  const cocOptions: MultiSelectOption[] = availableCoCs.map(coc => ({ value: coc, label: coc }));

  return (
    <div className="h-full flex flex-col">
      <div className="hidden md:flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
          Filters
        </h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors active:scale-95"
            title="Hide Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Measure Filter */}
        <div className="group">
          <MultiSelect
            label="Measure"
            value={filters.measure}
            onChange={handleMeasureChange}
            options={measureOptions}
            placeholder="Select Measure"
          />
          {filters.measure.length > 0 && (
            <div className="mt-2">
              <FilterTags
                label="Selected Measures"
                items={filters.measure}
                onRemove={(item) => setFilters(prev => ({ ...prev, measure: prev.measure.filter(i => i !== item) }))}
                onClearAll={() => setFilters(prev => ({ ...prev, measure: [] }))}
              />
            </div>
          )}
        </div>

        {/* CoC Number Filter */}
        <div className="group">
          <MultiSelect
            label="CoC Number"
            value={filters.cocNumber}
            onChange={handleCocNumberChange}
            options={cocOptions}
            placeholder="Select CoC Numbers"
          />
          {filters.cocNumber.length > 0 && (
            <div className="mt-2">
              <FilterTags
                label="Selected CoCs"
                items={filters.cocNumber}
                onRemove={(item) => setFilters(prev => ({ ...prev, cocNumber: prev.cocNumber.filter(i => i !== item) }))}
                onClearAll={() => setFilters(prev => ({ ...prev, cocNumber: [] }))}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md rounded-lg transition-all duration-200 h-[42px] font-medium active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Reset
        </button>
        
        <button
          onClick={onApply}
          className="flex-1 px-4 py-2 bg-indigo-500 border border-transparent text-white hover:bg-indigo-600 hover:shadow-md rounded-lg transition-all duration-200 h-[42px] font-medium active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Apply
        </button>
      </div>
    </div>
  );
}
