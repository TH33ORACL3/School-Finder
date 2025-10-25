import type { School } from '../types';
import { parseCSV } from '../utils/csvParser';

let cachedSchools: School[] | null = null;

export const loadCSVSchools = async (): Promise<School[]> => {
  if (cachedSchools) {
    return cachedSchools;
  }

  try {
    const response = await fetch('/schools_parklands_blouberg.csv');
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }

    const csvText = await response.text();
    const schools = parseCSV(csvText);
    
    cachedSchools = schools;
    return schools;
  } catch (error) {
    console.error('Error loading CSV schools:', error);
    return [];
  }
};

// Normalize school name for matching
const normalizeSchoolName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
};

// Check if two school names match (fuzzy matching)
const schoolNamesMatch = (name1: string, name2: string): boolean => {
  const norm1 = normalizeSchoolName(name1);
  const norm2 = normalizeSchoolName(name2);
  
  // Exact match
  if (norm1 === norm2) return true;
  
  // One contains the other (for cases like "School Name" vs "School Name Primary")
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  
  // Check for significant word overlap
  const words1 = norm1.split(' ').filter(w => w.length > 3);
  const words2 = norm2.split(' ').filter(w => w.length > 3);
  const commonWords = words1.filter(w => words2.includes(w));
  
  // If more than 50% of words match, consider it a match
  if (words1.length > 0 && commonWords.length / words1.length > 0.5) return true;
  
  return false;
};

// Find a matching school in CSV database by name
export const findCSVSchoolByName = async (schoolName: string): Promise<School | null> => {
  const csvSchools = await loadCSVSchools();
  
  for (const csvSchool of csvSchools) {
    if (schoolNamesMatch(schoolName, csvSchool.name)) {
      return csvSchool;
    }
  }
  
  return null;
};

// Enrich a school result with CSV data if available
export const enrichSchoolWithCSVData = async (school: School): Promise<School> => {
  const csvMatch = await findCSVSchoolByName(school.name);
  
  if (!csvMatch) {
    return school;
  }
  
  // Merge CSV data into the school, prioritizing CSV data for specific fields
  return {
    ...school,
    // Override with CSV data if available and not empty
    email: csvMatch.email || school.email,
    phone_number: csvMatch.phone_number || school.phone_number,
    tuition_range: csvMatch.tuition_range || school.tuition_range,
    fee_pdf_url: csvMatch.fee_pdf_url || school.fee_pdf_url,
    distance_km: csvMatch.distance_km ?? school.distance_km,
    // Keep CSV boolean values if they're true, otherwise keep AI values
    adhd_support: csvMatch.adhd_support || school.adhd_support,
    autism_support: csvMatch.autism_support ?? school.autism_support,
    has_on_site_therapists: csvMatch.has_on_site_therapists || school.has_on_site_therapists,
    offers_iep: csvMatch.offers_iep || school.offers_iep,
    has_sensory_friendly_facilities: csvMatch.has_sensory_friendly_facilities || school.has_sensory_friendly_facilities,
  };
};

// Enrich all schools in array with CSV data
export const enrichSchoolsWithCSVData = async (schools: School[]): Promise<School[]> => {
  return Promise.all(schools.map(school => enrichSchoolWithCSVData(school)));
};

// Search local CSV schools based on query
export const searchLocalSchools = async (query: string): Promise<School[]> => {
  const allSchools = await loadCSVSchools();
  
  if (!query || query.trim() === '') {
    return allSchools;
  }
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  return allSchools.filter(school => {
    const searchableText = [
      school.name,
      school.address,
      school.brief_description,
      school.educational_approach,
      ...school.special_needs_programs,
    ].join(' ').toLowerCase();
    
    // Check if any search term matches
    return searchTerms.some(term => searchableText.includes(term));
  });
};
