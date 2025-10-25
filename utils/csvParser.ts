import type { School } from '../types';

interface CSVRow {
  'School Name': string;
  'Address': string;
  'Phone': string;
  'Email': string;
  'Website': string;
  'Distance from Parklands (km)': string;
  'Grade 3 Fee Annual': string;
  'Grade 3 Fee Monthly': string;
  'Tuition Fee Link': string;
  'PDF Downloaded': string;
  'Grade Range': string;
  'Special Needs Programs': string;
  'ADHD Support': string;
  'Autism Support': string;
  'On-Site Therapists': string;
  'IEP/ISP Offered': string;
  'Sensory Facilities': string;
  'Educational Approach': string;
  'Brief Description': string;
  'Enrollment Status': string;
}

const parseBoolean = (value: string): boolean => {
  const normalized = value.toLowerCase().trim();
  return normalized === 'yes' || normalized === 'true';
};

const generateSchoolId = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const parseFeeLink = (pdfDownloaded: string, feeLink: string, schoolName: string): string | undefined => {
  if (pdfDownloaded.toLowerCase() === 'yes') {
    // Map school names to their fee document files (PDFs and TXT)
    const name = schoolName.toLowerCase();
    
    if (name.includes('shelanti')) {
      return '/fee-pdfs/Shelanti_2025_Fee_Structure.pdf';
    } else if (name.includes('blouberg international')) {
      return '/fee-pdfs/Blouberg_International_2023_Fees.pdf';
    } else if (name.includes('kay-dee') || name.includes('kaydee')) {
      return '/fee-pdfs/KayDee_Special_Needs_2025_Fees.pdf';
    } else if (name.includes('crossroads')) {
      return '/fee-pdfs/Crossroads_School_2025_Fees.pdf';
    } else if (name.includes('orion') && name.includes('primary')) {
      return '/fee-pdfs/Orion_College_Primary_2025_Fees.pdf';
    } else if (name.includes('orion') && name.includes('high')) {
      return '/fee-pdfs/Orion_College_High_School_2025_Fees.pdf';
    } else if (name.includes('orion') && !name.includes('primary') && !name.includes('high')) {
      // Generic Orion reference - could be either
      return '/fee-pdfs/Orion_College_2025_Fees.txt';
    } else if (name.includes('remedial school') || name.includes('tafelberg')) {
      return '/fee-pdfs/Remedial_School_2025_Fees.pdf';
    } else if (name.includes('browns') || name.includes('brown\'s')) {
      return '/fee-pdfs/Browns_School_2025_Fees.txt';
    } else if (name.includes('la vigne') || name.includes('lavigne')) {
      return '/fee-pdfs/La_Vigne_2025_Fees.txt';
    } else if (name.includes('excelsior')) {
      return '/fee-pdfs/Excelsior_Private_School_2025_Fees.txt';
    } else if (name.includes('via nova')) {
      return '/fee-pdfs/Via_Nova_School_2025_Fees.txt';
    } else if (name.includes('oakley')) {
      return '/fee-pdfs/Oakley_House_Prep_2025_Fees.pdf';
    }
  }
  return undefined;
};

const parseSpecialNeedsPrograms = (programs: string): string[] => {
  if (!programs || programs.trim() === '') return [];
  return programs.split(',').map(p => p.trim()).filter(p => p.length > 0);
};

const formatTuitionRange = (annual: string, monthly: string): string => {
  if (annual && annual !== 'Contact for fees' && !annual.toLowerCase().includes('contact')) {
    const tuitionText = annual;
    if (monthly && monthly !== 'Contact for fees' && !monthly.toLowerCase().includes('contact')) {
      return `${tuitionText} (${monthly} per month)`;
    }
    return tuitionText;
  }
  return 'Contact School for Fees';
};

export const parseCSVRow = (row: CSVRow): School => {
  const school: School = {
    id: generateSchoolId(row['School Name']),
    name: row['School Name'],
    address: row['Address'],
    website: row['Website'],
    phone_number: row['Phone'],
    email: row['Email'],
    tuition_range: formatTuitionRange(row['Grade 3 Fee Annual'], row['Grade 3 Fee Monthly']),
    fee_pdf_url: parseFeeLink(row['PDF Downloaded'], row['Tuition Fee Link'], row['School Name']),
    distance_km: parseFloat(row['Distance from Parklands (km)']) || 0,
    special_needs_programs: parseSpecialNeedsPrograms(row['Special Needs Programs']),
    adhd_support: parseBoolean(row['ADHD Support']),
    autism_support: parseBoolean(row['Autism Support']),
    average_class_size: 12, // Default, can be updated with real data
    has_on_site_therapists: parseBoolean(row['On-Site Therapists']),
    offers_iep: parseBoolean(row['IEP/ISP Offered']),
    has_sensory_friendly_facilities: parseBoolean(row['Sensory Facilities']),
    educational_approach: row['Educational Approach'],
    brief_description: row['Brief Description'],
    parent_testimonials: [],
    enrollment_status: (row['Enrollment Status'] as 'Open' | 'Waitlist' | 'Closed') || 'Open',
    lat: 0, // Will be set by geocoding if needed
    lng: 0,
  };

  return school;
};

export const parseCSV = (csvText: string): School[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const schools: School[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle CSV with quoted fields
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      try {
        const school = parseCSVRow(row as CSVRow);
        schools.push(school);
      } catch (error) {
        console.error(`Error parsing row ${i}:`, error);
      }
    }
  }

  return schools;
};
