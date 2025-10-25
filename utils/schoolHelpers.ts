import type { School, Filters } from '../types';

export const getAverageRating = (school: School): number => {
  if (school.parent_testimonials.length === 0) return 0;
  return school.parent_testimonials.reduce((acc, t) => acc + t.rating, 0) / school.parent_testimonials.length;
};

export const parseTuitionRange = (tuitionStr: string): number => {
  // Try to extract a numeric value from tuition string for sorting (supports R for Rands)
  const match = tuitionStr.match(/[R$]?\s?(\d+(?:,\d+)?(?:\s?\d+)?)/);
  if (match) {
    return parseInt(match[1].replace(/[,\s]/g, ''), 10);
  }
  return 0; // If we can't parse, put it at the beginning
};

export const filterSchools = (schools: School[], filters: Filters): School[] => {
  return schools.filter(school => {
    // Tuition filter
    const tuitionValue = parseTuitionRange(school.tuition_range);
    if (tuitionValue > 0 && (tuitionValue < filters.tuition[0] || tuitionValue > filters.tuition[1])) {
      return false;
    }

    // Class size filter
    if (school.average_class_size > filters.classSize) {
      return false;
    }

    // ADHD support filter
    if (filters.adhdSupport && !school.adhd_support) {
      return false;
    }

    // Therapists filter
    if (filters.therapists && !school.has_on_site_therapists) {
      return false;
    }

    // IEP filter
    if (filters.iep && !school.offers_iep) {
      return false;
    }

    // Sensory-friendly filter
    if (filters.sensoryFriendly && !school.has_sensory_friendly_facilities) {
      return false;
    }

    // Educational approach filter
    if (filters.educationalApproach.length > 0 && 
        !filters.educationalApproach.includes(school.educational_approach)) {
      return false;
    }

    return true;
  });
};

export type SortOption = 'rating' | 'distance' | 'tuition-low' | 'tuition-high' | 'class-size' | 'name';

export const sortSchools = (schools: School[], sortBy: SortOption): School[] => {
  const sorted = [...schools];
  
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => getAverageRating(b) - getAverageRating(a));
    
    case 'distance':
      return sorted.sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));
    
    case 'tuition-low':
      return sorted.sort((a, b) => parseTuitionRange(a.tuition_range) - parseTuitionRange(b.tuition_range));
    
    case 'tuition-high':
      return sorted.sort((a, b) => parseTuitionRange(b.tuition_range) - parseTuitionRange(a.tuition_range));
    
    case 'class-size':
      return sorted.sort((a, b) => a.average_class_size - b.average_class_size);
    
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    default:
      return sorted;
  }
};

export const getDefaultFilters = (): Filters => ({
  tuition: [0, 20000], // Monthly tuition in South African Rands
  classSize: 30,
  adhdSupport: false,
  therapists: false,
  iep: false,
  sensoryFriendly: false,
  educationalApproach: [],
});
