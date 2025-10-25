import React from 'react';
import type { Filters } from '../types';
import { FilterIcon, CloseIcon } from './icons';

interface MobileFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose: () => void;
  onClearFilters: () => void;
}

export const MobileFilters: React.FC<MobileFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-brand-600 to-brand-700 rounded-t-2xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-white" />
            <h3 className="text-lg font-bold text-white">Filters</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {/* Tuition Range */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Annual Tuition (Rands)
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Min: R{filters.tuition[0].toLocaleString()}</label>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={filters.tuition[0]}
                  onChange={(e) => updateFilter('tuition', [Number(e.target.value), filters.tuition[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Max: R{filters.tuition[1].toLocaleString()}</label>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={filters.tuition[1]}
                  onChange={(e) => updateFilter('tuition', [filters.tuition[0], Number(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.adhdSupport}
                  onChange={(e) => updateFilter('adhdSupport', e.target.checked)}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <span className="ml-3 text-sm text-gray-700">ADHD Support</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.therapists}
                  onChange={(e) => updateFilter('therapists', e.target.checked)}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <span className="ml-3 text-sm text-gray-700">On-site Therapists</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.iep}
                  onChange={(e) => updateFilter('iep', e.target.checked)}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <span className="ml-3 text-sm text-gray-700">IEP Programs</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.sensoryFriendly}
                  onChange={(e) => updateFilter('sensoryFriendly', e.target.checked)}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <span className="ml-3 text-sm text-gray-700">Sensory-Friendly Facilities</span>
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
                <label key={approach} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.educationalApproach.includes(approach)}
                    onChange={() => toggleApproach(approach)}
                    className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{approach}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={onClearFilters}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
