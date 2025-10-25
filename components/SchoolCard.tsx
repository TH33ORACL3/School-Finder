import React from 'react';
import type { School } from '../types';
import { LocationMarkerIcon, BookmarkIcon, CompareIcon } from './icons';

interface SchoolCardProps {
  school: School;
  onSelect: (school: School) => void;
  onBookmark: (schoolId: string) => void;
  onCompare: (schoolId: string) => void;
  isBookmarked: boolean;
  isComparing: boolean;
}

const EnrollmentBadge: React.FC<{ status: 'Open' | 'Waitlist' | 'Closed' }> = ({ status }) => {
  const colors = {
    Open: 'bg-green-100 text-green-800',
    Waitlist: 'bg-yellow-100 text-yellow-800',
    Closed: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
};

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onSelect, onBookmark, onCompare, isBookmarked, isComparing }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100 hover:border-brand-200">
      {/* Header with gradient overlay */}
      <div className="relative bg-gradient-to-br from-brand-500 to-brand-700 p-5 pb-16">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <h3 className="text-xl font-bold text-white drop-shadow-md">{school.name}</h3>
            <div className="flex items-center text-sm text-white/90 mt-2">
              <LocationMarkerIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{school.address}</span>
            </div>
            {school.distance_km !== undefined && school.distance_km !== null && (
              <div className="mt-1">
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
                  {school.distance_km === 0 ? 'In Parklands' : `${school.distance_km} km away`}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); onBookmark(school.id); }} 
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                isBookmarked 
                  ? 'bg-white text-brand-600 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <BookmarkIcon filled={isBookmarked} className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onCompare(school.id); }} 
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                isComparing 
                  ? 'bg-white text-brand-600 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isComparing ? 'Remove from comparison' : 'Add to comparison'}
            >
              <CompareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5 flex-grow -mt-12 relative z-10">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Enrollment:</span>
            </div>
            <EnrollmentBadge status={school.enrollment_status} />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Class Size</span>
            <span className="font-semibold text-gray-800">{school.average_class_size} students</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{school.brief_description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {school.adhd_support && (
            <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-semibold">
              ADHD Support
            </span>
          )}
          {school.offers_iep && (
            <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
              IEP
            </span>
          )}
          {school.has_on_site_therapists && (
            <span className="text-xs bg-rose-100 text-rose-800 px-3 py-1 rounded-full font-semibold">
              Therapists
            </span>
          )}
          {school.has_sensory_friendly_facilities && (
            <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
              Sensory-Friendly
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-3">
          <span className="font-semibold">Approach:</span> {school.educational_approach}
        </div>

        {(school.phone_number || school.email) && (
          <div className="text-xs text-gray-600 space-y-1 border-t pt-3">
            {school.phone_number && (
              <div>
                <a 
                  href={`tel:${school.phone_number}`} 
                  className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  📞 {school.phone_number}
                </a>
              </div>
            )}
            {school.email && (
              <div>
                <a 
                  href={`mailto:${school.email}`} 
                  className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  ✉️ {school.email}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-200 flex justify-between items-center">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Tuition</p>
          {school.tuition_range && school.tuition_range.trim() !== '' ? (
            <p className="text-lg font-bold text-brand-700">{school.tuition_range}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">Fee info pending</p>
          )}
        </div>
        <button 
          onClick={() => onSelect(school)} 
          className="bg-brand-600 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-brand-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
