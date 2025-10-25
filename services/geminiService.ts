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
    Based on this query, find special needs-friendly schools in or near "${locationQuery}".
    For each school found, provide the following information in a JSON array format inside a markdown code block.
    Ensure the JSON is well-formed. Each object in the array should represent a school and have these properties:
    - id: A unique string identifier.
    - name: string
    - address: string
    - website: string (full URL)
    - phone_number: string
    - tuition_range: string (e.g., "$5k-$10k", "Varies")
    - special_needs_programs: string[] (e.g., ["Autism Support", "Speech Therapy"])
    - adhd_support: boolean
    - average_class_size: number
    - has_on_site_therapists: boolean
    - offers_iep: boolean
    - has_sensory_friendly_facilities: boolean
    - educational_approach: string (e.g., "Montessori", "Remedial", "Mainstream Inclusion")
    - brief_description: A short paragraph about the school's special needs support.
    - parent_testimonials: An array of objects, each with 'author' (string), 'text' (string), and 'rating' (number from 1 to 5).
    - enrollment_status: 'Open', 'Waitlist', or 'Closed'.
    - lat: latitude coordinate (number)
    - lng: longitude coordinate (number)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: fullPrompt,
    config: {
      tools: [{ googleMaps: {} }],
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