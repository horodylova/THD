import React from 'react';
import { FilterState } from '@/types';
import { US_STATES } from '@/constants/states';
import { COC_NUMBERS } from '@/constants/coc_numbers';
import { MEASURES } from '@/constants/measures';

interface DataTableFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  onApply: () => void;
}

export default function DataTableFilters({
  filters,
  setFilters,
  onReset,
  onApply,
}: DataTableFiltersProps) {
  // Get available CoC numbers based on selected state
  const availableCoCs = filters.state ? COC_NUMBERS[filters.state] || [] : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If state changes, reset cocNumber
    if (name === 'state') {
      setFilters((prev) => ({ 
        ...prev, 
        [name]: value,
        cocNumber: '' // Reset CoC number when state changes
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Measure Filter */}
        <div className="col-span-1 md:col-span-2 group">
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
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* CoC Number Filter (Replaces Category) */}
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

        {/* CoC Name (Auto-filled) */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">CoC Name</label>
          <input
            type="text"
            readOnly
            disabled
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            placeholder="Auto-filled"
          />
        </div>

        {/* CoC Category (Auto-filled) */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">CoC Category</label>
          <input
            type="text"
            readOnly
            disabled
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            placeholder="Auto-filled"
          />
        </div>
        
        {/* Reset Button */}
        <div className="flex items-end gap-2 md:col-span-2 lg:col-span-2">
           <button
            onClick={onReset}
            className="w-1/2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md rounded-lg transition-all duration-200 h-[42px] font-medium active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reset
          </button>
          
          <button
            onClick={onApply}
            className="w-1/2 px-4 py-2 bg-indigo-500 border border-transparent text-white hover:bg-indigo-600 hover:shadow-md rounded-lg transition-all duration-200 h-[42px] font-medium active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
