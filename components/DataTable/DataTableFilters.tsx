import React from 'react';
import { FilterState } from '@/types';
import { MEASURES } from '@/constants/measures';

interface DataTableFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  onApply: () => void;
  availableStates: string[];
  availableCoCs: string[];
  cocName: string;
  cocCategory: string;
}

export default function DataTableFilters({
  filters,
  setFilters,
  onReset,
  onApply,
  availableStates,
  availableCoCs,
  cocName,
  cocCategory,
}: DataTableFiltersProps) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
     
    if (name === 'state') {
      setFilters((prev) => ({ 
        ...prev, 
        [name]: value,
        cocNumber: ''  
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
        Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Measure Filter */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-indigo-600">Measure</label>
          <select
            name="measure"
            value={filters.measure}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200 hover:border-indigo-300"
          >
            <option value="">Select Measure</option>
            {MEASURES.map((measure) => (
              <option key={measure} value={measure}>
                {measure}
              </option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-indigo-600">State</label>
          <select
            name="state"
            value={filters.state}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200 hover:border-indigo-300"
          >
            <option value="">Select State</option>
            {availableStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* CoC Number Filter */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-indigo-600">CoC Number</label>
          <select
            name="cocNumber"
            value={filters.cocNumber}
            onChange={handleInputChange}
            disabled={!filters.state} // Disabled if no state is selected
            className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200 hover:border-indigo-300 ${
              !filters.state ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
            }`}
          >
            <option value="">
              {!filters.state ? 'Select State first' : 'All CoC Numbers'}
            </option>
            {availableCoCs.map((coc) => (
              <option key={coc} value={coc}>
                {coc}
              </option>
            ))}
          </select>
        </div>

        {/* CoC Name (Read-only) */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-indigo-600">CoC Name</label>
          <input
            type="text"
            value={cocName}
            readOnly
            placeholder="Auto-filled"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-default focus:ring-0 focus:border-gray-200"
          />
        </div>

        {/* CoC Category (Read-only) */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-indigo-600">CoC Category</label>
          <input
            type="text"
            value={cocCategory}
            readOnly
            placeholder="Auto-filled"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-default focus:ring-0 focus:border-gray-200"
          />
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
