import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { School, Filters, GroundingChunk, ResourceArticle } from './types';
import { findSchools, getResources } from './services/geminiService';
import { SchoolCard } from './components/SchoolCard';
import { SchoolDetailModal } from './components/SchoolDetailModal';
import { FilterSidebar } from './components/FilterSidebar';
import { MobileFilters } from './components/MobileFilters';
import { ComparisonView } from './components/ComparisonView';
import { QuickFilters } from './components/QuickFilters';
import { EmptyState } from './components/EmptyState';
import { SchoolListSkeleton } from './components/LoadingSkeleton';
import { SearchIcon, LocationMarkerIcon, HeartIcon, SortIcon, MapIcon, GridIcon, FilterIcon } from './components/icons';
import { filterSchools, sortSchools, getDefaultFilters, type SortOption } from './utils/schoolHelpers';
import { loadBookmarks, saveBookmarks } from './utils/storage';

const Header: React.FC<{ onResourcesClick: () => void; bookmarkCount: number; onBookmarksClick: () => void }> = ({ 
  onResourcesClick, 
  bookmarkCount, 
  onBookmarksClick 
}) => (
    <header className="bg-gradient-to-r from-brand-800 to-brand-900 shadow-lg sticky top-0 z-40 border-b-2 border-brand-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">SA Special Needs School Finder</h1>
                <p className="text-brand-200 text-sm">Find the perfect school for your child in South Africa</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={onBookmarksClick} 
                    className="relative text-white font-semibold hover:bg-brand-700 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
                >
                    <HeartIcon className="w-5 h-5" filled={bookmarkCount > 0} />
                    <span className="hidden md:inline">Bookmarks</span>
                    {bookmarkCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {bookmarkCount}
                        </span>
                    )}
                </button>
                <button 
                    onClick={onResourcesClick} 
                    className="text-white font-semibold hover:bg-brand-700 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                    Resource Library
                </button>
            </div>
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
  // Search state
  const [prompt, setPrompt] = useState('Schools for a Grade 3 student with potential ADHD');
  const [locationQuery, setLocationQuery] = useState('Parklands, Cape Town, South Africa');
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  
  // UI state
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => loadBookmarks());
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter and sort state
  const [filters, setFilters] = useState<Filters>(getDefaultFilters());
  const [sortBy, setSortBy] = useState<SortOption>('rating');

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

  // Persist bookmarks to localStorage
  useEffect(() => {
    saveBookmarks(bookmarkedIds);
  }, [bookmarkedIds]);

  const toggleBookmark = useCallback((schoolId: string) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(schoolId)) {
        newSet.delete(schoolId);
      } else {
        newSet.add(schoolId);
      }
      return newSet;
    });
  }, []);

  const toggleCompare = useCallback((schoolId: string) => {
    setCompareIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(schoolId)) {
        newSet.delete(schoolId);
      } else {
        if (newSet.size >= 4) {
          alert('You can compare up to 4 schools at a time');
          return prev;
        }
        newSet.add(schoolId);
      }
      return newSet;
    });
  }, []);

  // Computed values: filter and sort schools
  const displaySchools = useMemo(() => {
    let result = showBookmarksOnly
      ? schools.filter(school => bookmarkedIds.has(school.id))
      : schools;
    
    result = filterSchools(result, filters);
    result = sortSchools(result, sortBy);
    
    return result;
  }, [schools, filters, sortBy, showBookmarksOnly, bookmarkedIds]);

  const comparedSchools = useMemo(() => {
    return schools.filter(school => compareIds.has(school.id));
  }, [schools, compareIds]);

  const quickFilters = useMemo(() => [
    { label: 'ADHD Support', key: 'adhdSupport', active: filters.adhdSupport },
    { label: 'IEP Programs', key: 'iep', active: filters.iep },
    { label: 'On-site Therapists', key: 'therapists', active: filters.therapists },
    { label: 'Sensory-Friendly', key: 'sensoryFriendly', active: filters.sensoryFriendly },
  ], [filters]);

  const handleQuickFilterToggle = useCallback((key: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key as keyof Filters],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(getDefaultFilters());
  }, []);

  const handleShowComparison = useCallback(() => {
    if (compareIds.size === 0) {
      alert('Please select at least one school to compare');
      return;
    }
    setShowComparison(true);
  }, [compareIds.size]);

  const handleRemoveFromComparison = useCallback((schoolId: string) => {
    setCompareIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(schoolId);
      return newSet;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-brand-50 font-sans">
      <Header 
        onResourcesClick={() => setIsResourcesOpen(true)} 
        bookmarkCount={bookmarkedIds.size}
        onBookmarksClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
      />
      
      <main className="container mx-auto p-4 md:p-6">
        {/* Search Section */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Find the Right School for Your Child</h2>
            <p className="text-gray-600">Discover special needs-friendly schools across South Africa with real fees and verified information.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div className="relative md:col-span-2">
              <label htmlFor="prompt-input" className="block text-sm font-semibold text-gray-700 mb-2">
                What are you looking for?
              </label>
              <div className="relative">
                <input
                  id="prompt-input"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Montessori with speech therapy"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="relative md:col-span-2">
              <label htmlFor="location-input" className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <input
                  id="location-input"
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="e.g., Sandton, Johannesburg or Cape Town"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="md:col-span-1 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold py-3 px-6 rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all duration-200 disabled:from-brand-300 disabled:to-brand-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Quick Filters & Actions Bar */}
        {schools.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <QuickFilters filters={quickFilters} onToggle={handleQuickFilterToggle} />
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <FilterIcon className="w-4 h-4" />
                  Filters
                </button>
                
                <button
                  onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    showBookmarksOnly
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <HeartIcon className="w-4 h-4" filled={showBookmarksOnly} />
                  <span className="hidden sm:inline">{showBookmarksOnly ? 'Show All' : 'Bookmarks'}</span>
                  <span className="sm:hidden">({bookmarkedIds.size})</span>
                  <span className="hidden sm:inline">({bookmarkedIds.size})</span>
                </button>
                
                <button
                  onClick={handleShowComparison}
                  disabled={compareIds.size === 0}
                  className="px-4 py-2 rounded-lg font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  Compare ({compareIds.size})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {schools.length > 0 && (
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={displaySchools.length}
                onClearFilters={handleClearFilters}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-grow">
              {/* Sort and View Options */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">
                    {showBookmarksOnly && bookmarkedIds.size > 0 && 'Your Bookmarks • '}
                    <span className="font-semibold text-gray-800">
                      {displaySchools.length} {displaySchools.length === 1 ? 'school' : 'schools'} found
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <SortIcon className="w-5 h-5 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="tuition-low">Tuition: Low to High</option>
                    <option value="tuition-high">Tuition: High to Low</option>
                    <option value="class-size">Smallest Class Size</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Schools Grid */}
              {isLoading ? (
                <SchoolListSkeleton count={6} />
              ) : displaySchools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displaySchools.map((school) => (
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
              ) : (
                <EmptyState
                  title={showBookmarksOnly ? "No bookmarked schools" : "No schools match your filters"}
                  description={
                    showBookmarksOnly
                      ? "You haven't bookmarked any schools yet. Browse and bookmark schools to see them here."
                      : "Try adjusting your filters or search criteria to find more schools."
                  }
                  actionLabel={showBookmarksOnly ? "Show All Schools" : "Clear Filters"}
                  onAction={showBookmarksOnly ? () => setShowBookmarksOnly(false) : handleClearFilters}
                />
              )}

              {/* Grounding Sources */}
              {!isLoading && groundingChunks.length > 0 && (
                <div className="mt-6">
                  <GroundingSources chunks={groundingChunks} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initial State / Error */}
        {!isLoading && schools.length === 0 && !error && (
          <EmptyState
            title="Start Your Search"
            description="Enter what you're looking for and your location to find the best special needs schools for your child."
            actionLabel="Try Example Search"
            onAction={handleSearch}
          />
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-semibold mb-2">Oops! Something went wrong</p>
            <p className="text-red-600">{error}</p>
            <button
              onClick={handleSearch}
              className="mt-4 bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <SchoolDetailModal school={selectedSchool} onClose={() => setSelectedSchool(null)} />
      {isResourcesOpen && <ResourceLibraryModal onClose={() => setIsResourcesOpen(false)} />}
      {showComparison && (
        <ComparisonView
          schools={comparedSchools}
          onClose={() => setShowComparison(false)}
          onRemoveSchool={handleRemoveFromComparison}
        />
      )}
      {showMobileFilters && (
        <MobileFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowMobileFilters(false)}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
}