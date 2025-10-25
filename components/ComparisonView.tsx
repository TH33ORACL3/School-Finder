import React from 'react';
import type { School } from '../types';
import { StarIcon, LocationMarkerIcon, CloseIcon } from './icons';

interface ComparisonViewProps {
  schools: School[];
  onClose: () => void;
  onRemoveSchool: (schoolId: string) => void;
}

const ComparisonRow: React.FC<{ label: string; values: (string | number | boolean)[] }> = ({ label, values }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50 sticky left-0">{label}</td>
    {values.map((value, i) => (
      <td key={i} className="py-4 px-4 text-gray-800">
        {typeof value === 'boolean' ? (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {value ? 'Yes' : 'No'}
          </span>
        ) : (
          value
        )}
      </td>
    ))}
  </tr>
);

export const ComparisonView: React.FC<ComparisonViewProps> = ({ schools, onClose, onRemoveSchool }) => {
  if (schools.length === 0) return null;

  const avgRatings = schools.map(school => 
    school.parent_testimonials.length > 0
      ? (school.parent_testimonials.reduce((acc, t) => acc + t.rating, 0) / school.parent_testimonials.length).toFixed(1)
      : 'N/A'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-brand-600 to-brand-700">
          <h2 className="text-2xl font-bold text-white">Compare Schools</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-auto flex-grow">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="py-4 px-4 text-left font-bold text-gray-700 bg-gray-100 sticky left-0">Feature</th>
                {schools.map(school => (
                  <th key={school.id} className="py-4 px-4 min-w-[250px]">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center justify-between w-full mb-2">
                        <h3 className="font-bold text-brand-800 text-left">{school.name}</h3>
                        <button
                          onClick={() => onRemoveSchool(school.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <CloseIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <LocationMarkerIcon className="w-3 h-3 mr-1" />
                        <span className="text-left">{school.address}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <ComparisonRow 
                label="Average Rating" 
                values={avgRatings}
              />
              <ComparisonRow 
                label="Tuition Range" 
                values={schools.map(s => s.tuition_range)}
              />
              <ComparisonRow 
                label="Average Class Size" 
                values={schools.map(s => s.average_class_size)}
              />
              <ComparisonRow 
                label="Enrollment Status" 
                values={schools.map(s => s.enrollment_status)}
              />
              <ComparisonRow 
                label="Educational Approach" 
                values={schools.map(s => s.educational_approach)}
              />
              <ComparisonRow 
                label="ADHD Support" 
                values={schools.map(s => s.adhd_support)}
              />
              <ComparisonRow 
                label="IEP Programs" 
                values={schools.map(s => s.offers_iep)}
              />
              <ComparisonRow 
                label="On-site Therapists" 
                values={schools.map(s => s.has_on_site_therapists)}
              />
              <ComparisonRow 
                label="Sensory-Friendly" 
                values={schools.map(s => s.has_sensory_friendly_facilities)}
              />
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50 sticky left-0">Special Programs</td>
                {schools.map(school => (
                  <td key={school.id} className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {school.special_needs_programs.map(program => (
                        <span key={program} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {program}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 font-semibold text-gray-700 bg-gray-50 sticky left-0">Contact</td>
                {schools.map(school => (
                  <td key={school.id} className="py-4 px-4">
                    <div className="space-y-2">
                      <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline text-sm block">
                        Visit Website
                      </a>
                      <a href={`tel:${school.phone_number}`} className="text-brand-600 hover:underline text-sm block">
                        {school.phone_number}
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-600">
          Comparing {schools.length} {schools.length === 1 ? 'school' : 'schools'}
        </div>
      </div>
    </div>
  );
};
