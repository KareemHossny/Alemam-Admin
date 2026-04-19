import React, { useMemo, useState } from 'react';
import { FiCheck, FiSearch, FiX } from 'react-icons/fi';

const SearchableMultiSelect = ({
  id,
  options = [],
  value = [],
  onChange,
  placeholder = 'Search options...',
  emptyLabel = 'No matches found.',
  selectedLabel = 'selected',
}) => {
  const [query, setQuery] = useState('');

  const selectedValues = useMemo(() => (
    Array.isArray(value) ? value : []
  ), [value]);

  const normalizedOptions = useMemo(() => (
    options.map((option) => ({
      value: String(option.value),
      label: option.label,
      description: option.description || '',
    }))
  ), [options]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return normalizedOptions;
    }

    return normalizedOptions.filter((option) => (
      `${option.label} ${option.description}`.toLowerCase().includes(normalizedQuery)
    ));
  }, [normalizedOptions, query]);

  const selectedItems = useMemo(() => (
    normalizedOptions.filter((option) => selectedValues.includes(option.value))
  ), [normalizedOptions, selectedValues]);

  const toggleValue = (nextValue) => {
    const hasValue = selectedValues.includes(nextValue);
    const nextSelection = hasValue
      ? selectedValues.filter((valueItem) => valueItem !== nextValue)
      : [...selectedValues, nextValue];

    onChange(nextSelection);
  };

  const clearSelection = () => {
    onChange([]);
  };

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-sm transition-colors duration-300 focus-within:border-blue-500 hover:border-blue-300">
      <div className="border-b border-gray-200 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {selectedItems.length} {selectedLabel}
            </p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Search and tap to add or remove people.
            </p>
          </div>

          {selectedItems.length > 0 ? (
            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
            >
              <FiX className="h-4 w-4" />
              <span>Clear</span>
            </button>
          ) : null}
        </div>

        {selectedItems.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleValue(item.value)}
                className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 sm:text-sm"
              >
                <span>{item.label}</span>
                <FiX className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="border-b border-gray-200 px-4 py-4 sm:px-5">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:h-5 sm:w-5" />
          <input
            id={id}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 focus:bg-white sm:text-base"
          />
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto px-3 py-3 sm:px-4">
        {filteredOptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
            {emptyLabel}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-all ${
                    isSelected
                      ? 'border-blue-300 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleValue(option.value)}
                    className="sr-only"
                  />
                  <div
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-transparent'
                    }`}
                  >
                    <FiCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-800 sm:text-base">
                      {option.label}
                    </div>
                    {option.description ? (
                      <div className="mt-1 break-words text-xs text-gray-500 sm:text-sm">
                        {option.description}
                      </div>
                    ) : null}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableMultiSelect;
