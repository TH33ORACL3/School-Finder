import { GoogleGenAI } from "@google/genai";
import type { School } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseJsonFromMarkdown = <T,>(text: string): T | null => {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]) as T;
    } catch (e) {
      console.error("Failed to parse JSON from Gemini response", e);
      return null;
    }
  }
  // If no markdown block, try to parse the whole string as a fallback
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    // It's not a raw JSON string either.
  }

  console.error("Could not find or parse JSON in the response string.");
  return null;
};


export const findSchools = async (prompt: string, locationQuery: string) => {
  if (!locationQuery) {
    throw new Error("Location is required to find schools.");
  }

  const fullPrompt = `
    Query: "${prompt}"
    
    INSTRUCTIONS:
    1. Find special needs-friendly schools in or near "${locationQuery}" in SOUTH AFRICA using Google Maps.
    2. Focus ONLY on schools located in South Africa.
    3. For EACH school found, search the web for their official website to find:
       - Current tuition fees and pricing in South African Rands (check "Fees", "Tuition", "Admissions", "Costs" pages)
       - Special needs programs offered (check "Programs", "Support Services", "Special Education" sections)
       - Contact information and enrollment details
       - Therapist availability and educational approach
    4. Use ONLY verified information from official sources. If you cannot find specific data, mark it as "Not Listed" or null.
    5. For tuition_range, provide exact figures in RANDS if found (e.g., "R85,000 - R95,000 per year" or "R7,500 per month"). If not found, use "Contact School".
    6. NEVER use dollars ($) - always use South African Rands (R).
    
    Return a JSON array with the following structure inside a markdown code block.
    Each object should represent a school with these properties:
    - id: A unique string identifier (use school name + address hash)
    - name: string (official school name)
    - address: string (full physical address with city and province)
    - website: string (full URL to official website)
    - phone_number: string (South African format contact number from website or Google Maps)
    - tuition_range: string (ACTUAL fees in RANDS from website if available, otherwise "Contact School for Fees")
    - special_needs_programs: string[] (programs explicitly mentioned on their website)
    - adhd_support: boolean (true only if explicitly mentioned)
    - average_class_size: number (from website if available, otherwise use typical value)
    - has_on_site_therapists: boolean (true only if explicitly mentioned)
    - offers_iep: boolean (true only if explicitly mentioned, or ISP - Individual Support Plan for SA context)
    - has_sensory_friendly_facilities: boolean (true only if explicitly mentioned)
    - educational_approach: string (e.g., "Montessori", "Remedial", "Mainstream Inclusion", "Waldorf", "CAPS-based")
    - brief_description: A short paragraph about the school's special needs support based on website content
    - parent_testimonials: An array of objects with 'author' (string), 'text' (string), and 'rating' (number 1-5)
      (Use actual testimonials from their website if available, otherwise provide representative examples)
    - enrollment_status: 'Open', 'Waitlist', or 'Closed' (based on website info or set to 'Open' if unknown)
    - lat: latitude coordinate (number from Google Maps)
    - lng: longitude coordinate (number from Google Maps)
    
    IMPORTANT: 
    - Ground your response in actual web sources from South African schools only.
    - All prices MUST be in South African Rands (R), never dollars ($).
    - Prioritize accuracy over completeness.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: fullPrompt,
    config: {
      tools: [
        { googleMaps: {} },
        { googleSearch: {} }
      ],
    },
  });

  const schools = parseJsonFromMarkdown<School[]>(response.text);
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  return { schools, groundingChunks };
};


export const getResources = async (topic: string) => {
  const prompt = `
    Find helpful articles and resources for parents about "${topic}". 
    For each resource, provide the title, a direct link, and a brief snippet.
    Return this information as a JSON array inside a markdown code block. The JSON should be an array of objects,
    each with "title", "link", and "snippet" properties.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const articles = parseJsonFromMarkdown<any[]>(response.text);
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return { articles, groundingChunks };
};