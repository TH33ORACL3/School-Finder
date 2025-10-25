import React from 'react';
import type { School, ParentTestimonial } from '../types';
import { LocationMarkerIcon, StarIcon } from './icons';

interface SchoolDetailModalProps {
  school: School | null;
  onClose: () => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    {children}
  </div>
);

const InfoPill: React.FC<{ label: string, value: string | number | boolean }> = ({ label, value }) => {
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    const valueColor = typeof value === 'boolean' ? (value ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100') : 'text-gray-800 bg-gray-100';
    return (
        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md text-sm">
            <span className="font-medium text-gray-600">{label}</span>
            <span className={`font-bold px-2 py-1 rounded-full text-xs ${valueColor}`}>{displayValue}</span>
        </div>
    );
};

const TestimonialCard: React.FC<{ testimonial: ParentTestimonial }> = ({ testimonial }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < testimonial.rating} className="w-4 h-4 text-yellow-400" />
            ))}
             <p className="ml-2 font-bold text-sm text-gray-800">{testimonial.author}</p>
        </div>
        <p className="text-gray-600 text-sm italic">"{testimonial.text}"</p>
    </div>
);


export const SchoolDetailModal: React.FC<SchoolDetailModalProps> = ({ school, onClose }) => {
  if (!school) return null;

  const avgRating = school.parent_testimonials.length > 0
    ? school.parent_testimonials.reduce((acc, t) => acc + t.rating, 0) / school.parent_testimonials.length
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        {/* Header with Gradient */}
        <div className="p-6 bg-gradient-to-r from-brand-600 to-brand-800 sticky top-0 z-10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{school.name}</h2>
                <div className="flex items-center text-sm text-white/90">
                    <LocationMarkerIcon className="w-4 h-4 mr-1" />
                    <span>{school.address}</span>
                </div>
                {avgRating > 0 && (
                  <div className="flex items-center mt-3 gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} filled={i < Math.round(avgRating)} className="w-5 h-5 text-yellow-300" />
                      ))}
                    </div>
                    <span className="text-white font-semibold">{avgRating.toFixed(1)}</span>
                    <span className="text-white/70 text-sm">({school.parent_testimonials.length} reviews)</span>
                  </div>
                )}
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all ml-4"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
            <DetailSection title="Overview">
                <p className="text-gray-700">{school.brief_description}</p>
            </DetailSection>

            <DetailSection title="Key Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoPill label="Tuition Range" value={school.tuition_range} />
                    <InfoPill label="Avg. Class Size" value={school.average_class_size} />
                    <InfoPill label="Enrollment Status" value={school.enrollment_status} />
                    <InfoPill label="Educational Approach" value={school.educational_approach} />
                </div>
            </DetailSection>

             <DetailSection title="Special Needs Support">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoPill label="ADHD Support" value={school.adhd_support} />
                    <InfoPill label="Offers IEP" value={school.offers_iep} />
                    <InfoPill label="On-site Therapists" value={school.has_on_site_therapists} />
                    <InfoPill label="Sensory-Friendly Facilities" value={school.has_sensory_friendly_facilities} />
                </div>
                 <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Programs Offered:</h4>
                     <div className="flex flex-wrap gap-2">
                        {school.special_needs_programs.map(program => (
                            <span key={program} className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{program}</span>
                        ))}
                    </div>
                </div>
            </DetailSection>

            <DetailSection title="Parent Testimonials">
                <div className="space-y-4">
                    {school.parent_testimonials.length > 0 ? (
                        school.parent_testimonials.map((t, i) => <TestimonialCard key={i} testimonial={t} />)
                    ) : (
                        <p className="text-gray-500">No testimonials available yet.</p>
                    )}
                </div>
            </DetailSection>

             <DetailSection title="Contact & More Info">
                 <div className="flex space-x-4">
                    <a href={school.website} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-700 transition-colors">Visit Website</a>
                    <a href={`tel:${school.phone_number}`} className="flex-1 text-center bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">Call School</a>
                 </div>
            </DetailSection>
        </div>
      </div>
    </div>
  );
};
