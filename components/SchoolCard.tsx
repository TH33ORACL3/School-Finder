import React from 'react';
import type { School } from '../types';
import { LocationMarkerIcon, BookmarkIcon, CompareIcon, StarIcon } from './icons';

interface SchoolCardProps {
  school: School;
  onSelect: (school: School) => void;
  onBookmark: (schoolId: string) => void;
  onCompare: (schoolId: string) => void;
  isBookmarked: boolean;
  isComparing: boolean;
}

const Rating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} filled={i < rating} className="text-yellow-400" />
    ))}
  </div>
);

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onSelect, onBookmark, onCompare, isBookmarked, isComparing }) => {
  const avgRating = school.parent_testimonials.length > 0
    ? school.parent_testimonials.reduce((acc, t) => acc + t.rating, 0) / school.parent_testimonials.length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-brand-800 pr-4">{school.name}</h3>
          <div className="flex items-center space-x-2 flex-shrink-0">
             <button onClick={(e) => { e.stopPropagation(); onBookmark(school.id); }} className={`p-2 rounded-full hover:bg-gray-200 ${isBookmarked ? 'text-brand-600' : 'text-gray-400'}`}>
                <BookmarkIcon filled={isBookmarked} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onCompare(school.id); }} className={`p-2 rounded-full hover:bg-gray-200 ${isComparing ? 'text-brand-600' : 'text-gray-400'}`}>
                <CompareIcon />
            </button>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <LocationMarkerIcon className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{school.address}</span>
        </div>
        {avgRating > 0 && 
            <div className="flex items-center mt-2">
                <Rating rating={Math.round(avgRating)} />
                <span className="text-xs text-gray-500 ml-2">({school.parent_testimonials.length} reviews)</span>
            </div>
        }

        <p className="text-gray-600 mt-3 text-sm line-clamp-2">{school.brief_description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
            {school.adhd_support && <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-semibold">ADHD Support</span>}
            {school.offers_iep && <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-semibold">IEP Offered</span>}
            {school.has_on_site_therapists && <span className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full font-semibold">On-site Therapists</span>}
        </div>
      </div>
       <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
        <div>
            <p className="text-sm font-semibold text-gray-700">Tuition</p>
            <p className="text-lg font-bold text-brand-700">{school.tuition_range}</p>
        </div>
        <button onClick={() => onSelect(school)} className="bg-brand-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-700 transition-colors">
            View Details
        </button>
      </div>
    </div>
  );
};
