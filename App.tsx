import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { School, Filters, GroundingChunk, ResourceArticle } from './types';
import { findSchools, getResources } from './services/geminiService';
import { SchoolCard } from './components/SchoolCard';
import { SchoolDetailModal } from './components/SchoolDetailModal';
import { SearchIcon, LocationMarkerIcon } from './components/icons';

const Header: React.FC<{ onResourcesClick: () => void }> = ({ onResourcesClick }) => (
    <header className="bg-brand-800 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">Special Needs School Finder</h1>
            <button onClick={onResourcesClick} className="text-white font-semibold hover:bg-brand-700 px-3 py-2 rounded-md transition-colors">
                Resource Library
            </button>
        </div>
    </header>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
    </div>
);

const GroundingSources: React.FC<{ chunks: GroundingChunk[] }> = ({ chunks }) => {
    if (chunks.length === 0) return null;
    const sources = chunks.flatMap(c => c.web || c.maps || []);

    return (
        <div className="bg-gray-100 p-3 rounded-lg mt-4 text-xs">
            <h4 className="font-semibold mb-2 text-gray-600">Information Sources:</h4>
            <ul className="list-disc list-inside space-y-1">
                {sources.map((source, index) => (
                    <li key={index}>
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline truncate">
                            {source.title || new URL(source.uri).hostname}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ResourceLibraryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [topic, setTopic] = useState('ADHD management in educational settings');
    const [articles, setArticles] = useState<ResourceArticle[]>([]);
    const [chunks, setChunks] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async () => {
        if (!topic) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await getResources(topic);
            setArticles(result.articles || []);
            setChunks(result.groundingChunks || []);
        } catch (err) {
            setError('Failed to fetch resources. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    useEffect(() => {
        fetchResources();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchResources();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-brand-800">Resource Library</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Parent support groups"
                            className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                        <button type="submit" className="bg-brand-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-700 transition-colors disabled:bg-brand-300" disabled={isLoading}>
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    {isLoading && <LoadingSpinner />}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {!isLoading && !error && (
                        <div className="space-y-4">
                            {articles.map((article, i) => (
                                <div key={i} className="p-4 border rounded-lg hover:bg-gray-50">
                                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-brand-700 hover:underline">{article.title}</a>
                                    <p className="text-sm text-gray-600 mt-1">{article.snippet}</p>
                                </div>
                            ))}
                            <GroundingSources chunks={chunks} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function App() {
  const [prompt, setPrompt] = useState('Schools for a grade 3 student with potential ADHD');
  const [locationQuery, setLocationQuery] = useState('Parklands, Cape Town');
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const handleSearch = async () => {
    if (!prompt || !locationQuery) {
      setError("Please enter a search query and a location.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSchools([]);
    setGroundingChunks([]);

    try {
      const { schools: foundSchools, groundingChunks: chunks } = await findSchools(prompt, locationQuery);
      setSchools(foundSchools || []);
      setGroundingChunks(chunks || []);
      if (!foundSchools || foundSchools.length === 0) {
          setError("No schools found. Try a different search query or location.");
      }
    } catch (err) {
      setError("An error occurred while searching for schools. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = (schoolId: string) => {
      setBookmarkedIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(schoolId)) {
              newSet.delete(schoolId);
          } else {
              newSet.add(schoolId);
          }
          return newSet;
      });
  };

  const toggleCompare = (schoolId: string) => {
      setCompareIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(schoolId)) {
              newSet.delete(schoolId);
          } else {
              newSet.add(schoolId);
          }
          return newSet;
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header onResourcesClick={() => setIsResourcesOpen(true)} />
      <main className="container mx-auto p-4 md:p-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Find the Right School for Your Child</h2>
          <p className="text-gray-500 mt-1">Describe what you're looking for, and we'll find matching schools in your desired area.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div className="relative md:col-span-2">
              <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 mb-1">Looking for...</label>
              <div className="relative">
                 <input
                    id="prompt-input"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Montessori with speech therapy"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="relative md:col-span-2">
              <label htmlFor="location-input" className="block text-sm font-medium text-gray-700 mb-1">Near...</label>
              <div className="relative">
                <input
                    id="location-input"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="e.g., Parklands, Cape Town"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="md:col-span-1 bg-brand-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-700 transition-colors disabled:bg-brand-300 disabled:cursor-not-allowed flex items-center justify-center w-full"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="mt-6">
          {isLoading && <LoadingSpinner />}
          {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
          {!isLoading && schools.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => (
                <SchoolCard 
                    key={school.id} 
                    school={school} 
                    onSelect={setSelectedSchool}
                    onBookmark={toggleBookmark}
                    isBookmarked={bookmarkedIds.has(school.id)}
                    onCompare={toggleCompare}
                    isComparing={compareIds.has(school.id)}
                />
              ))}
            </div>
          )}
          {!isLoading && groundingChunks.length > 0 && (
            <div className="mt-6 max-w-4xl mx-auto">
                <GroundingSources chunks={groundingChunks} />
            </div>
          )}
        </div>
      </main>
      <SchoolDetailModal school={selectedSchool} onClose={() => setSelectedSchool(null)} />
      {isResourcesOpen && <ResourceLibraryModal onClose={() => setIsResourcesOpen(false)} />}
    </div>
  );
}