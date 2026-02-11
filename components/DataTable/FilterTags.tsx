import React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface FilterTagsProps {
  label: string;
  items: string[];
  onRemove: (item: string) => void;
  onClearAll?: () => void;
}

export default function FilterTags({ label, items, onRemove, onClearAll }: FilterTagsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
        {onClearAll && (
          <button 
            onClick={onClearAll}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span 
            key={item} 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-600 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white transition-colors"
            >
              <span className="sr-only">Remove {item}</span>
              <XMarkIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
