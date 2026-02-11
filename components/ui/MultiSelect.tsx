import React, { Fragment } from 'react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select options',
  disabled = false,
}: MultiSelectProps) {
  // Ensure value is always an array
  const selectedValues = Array.isArray(value) ? value : [];

  return (
    <Listbox value={selectedValues} onChange={onChange} disabled={disabled} multiple>
      <div className="relative mt-1">
        {label && (
          <Label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-indigo-600">
            {label}
          </Label>
        )}
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm hover:border-indigo-300 transition-colors duration-200 min-h-[42px]">
          <ListboxButton className={`w-full cursor-default py-2 pl-3 pr-10 text-left bg-white focus:outline-none ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''}`}>
            <span className={`block truncate ${selectedValues.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
              {selectedValues.length === 0 
                ? placeholder 
                : `${selectedValues.length} selected`}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
            {options.length === 0 ? (
               <div className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-500 italic">
                 No options available
               </div>
            ) : (
              options.map((option, optionIdx) => (
                <ListboxOption
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))
            )}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
