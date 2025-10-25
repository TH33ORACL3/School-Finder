export interface School {
  id: string;
  name: string;
  address: string;
  website: string;
  phone_number: string;
  tuition_range: string;
  special_needs_programs: string[];
  adhd_support: boolean;
  average_class_size: number;
  has_on_site_therapists: boolean;
  offers_iep: boolean;
  has_sensory_friendly_facilities: boolean;
  educational_approach: string;
  brief_description: string;
  parent_testimonials: ParentTestimonial[];
  enrollment_status: 'Open' | 'Waitlist' | 'Closed';
  lat: number;
  lng: number;
}

export interface ParentTestimonial {
  author: string;
  text: string;
  rating: number; // 1 to 5
}

export interface Filters {
  tuition: [number, number];
  classSize: number;
  adhdSupport: boolean;
  therapists: boolean;
  iep: boolean;
  sensoryFriendly: boolean;
  educationalApproach: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface ResourceArticle {
  title: string;
  link: string;
  snippet: string;
}