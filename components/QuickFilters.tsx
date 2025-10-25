import React from 'react';

interface QuickFilter {
  label: string;
  key: string;
  active: boolean;
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  onToggle: (key: string) => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({ filters, onToggle }) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onToggle(filter.key)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            filter.active
              ? 'bg-brand-600 text-white shadow-md hover:bg-brand-700 transform scale-105'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-brand-400 hover:bg-brand-50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
