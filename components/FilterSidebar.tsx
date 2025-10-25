import React from 'react';
import type { Filters } from '../types';
import { FilterIcon } from './icons';

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  resultCount: number;
  onClearFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  onFiltersChange, 
  resultCount,
  onClearFilters 
}) => {
  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleApproach = (approach: string) => {
    const updated = filters.educationalApproach.includes(approach)
      ? filters.educationalApproach.filter(a => a !== approach)
      : [...filters.educationalApproach, approach];
    updateFilter('educationalApproach', updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24 h-fit">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-brand-600" />
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        </div>
        <button 
          onClick={onClearFilters}
          className="text-sm text-brand-600 hover:text-brand-700 font-semibold"
        >
          Clear All
        </button>
      </div>

      <div className="mb-6 p-3 bg-brand-50 rounded-lg">
        <p className="text-sm font-semibold text-brand-800">
          {resultCount} {resultCount === 1 ? 'school' : 'schools'} found
        </p>
      </div>

      {/* Tuition Range */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Monthly Tuition (Rands)
        </label>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Min: R{filters.tuition[0].toLocaleString()}</label>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={filters.tuition[0]}
              onChange={(e) => updateFilter('tuition', [Number(e.target.value), filters.tuition[1]])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Max: R{filters.tuition[1].toLocaleString()}</label>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={filters.tuition[1]}
              onChange={(e) => updateFilter('tuition', [filters.tuition[0], Number(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Class Size */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Max Class Size: {filters.classSize}
        </label>
        <input
          type="range"
          min="5"
          max="30"
          value={filters.classSize}
          onChange={(e) => updateFilter('classSize', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5</span>
          <span>30</span>
        </div>
      </div>

      {/* Support Features */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Support Features
        </label>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.adhdSupport}
              onChange={(e) => updateFilter('adhdSupport', e.target.checked)}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">ADHD Support</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.therapists}
              onChange={(e) => updateFilter('therapists', e.target.checked)}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">On-site Therapists</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.iep}
              onChange={(e) => updateFilter('iep', e.target.checked)}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">IEP Programs</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.sensoryFriendly}
              onChange={(e) => updateFilter('sensoryFriendly', e.target.checked)}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">Sensory-Friendly Facilities</span>
          </label>
        </div>
      </div>

      {/* Educational Approach */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Educational Approach
        </label>
        <div className="space-y-2">
          {['Montessori', 'Remedial', 'Mainstream Inclusion', 'Waldorf', 'CAPS-based', 'Traditional'].map(approach => (
            <label key={approach} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.educationalApproach.includes(approach)}
                onChange={() => toggleApproach(approach)}
                className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{approach}</span>
            </label>
          ))}
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3c82e8;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3c82e8;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};
