import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { useBookSearch } from '../hooks/useBookSearch';
import { useBooks } from '../context/BookContext';
import BookCard from './BookCard';
import { Genre } from '../types';
import GenreTab from './GenreTab';

const FEATURED_GENRES: Genre[] = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Biography',
  'Self-Help',
  'Business',
  'Romance',
  'History',
];

const Explore: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recentSearches } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const { 
    books, 
    loading, 
    error, 
    totalItems, 
    search, 
    loadMore, 
    hasMore 
  } = useBookSearch();

  // Handle initial search from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    const filterParam = params.get('filter');
    
    if (queryParam) {
      setSearchQuery(queryParam);
      search(queryParam);
    } else if (filterParam === 'trending') {
      search('subject:fiction');
    }
  }, [location.search, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      search(searchQuery);
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery('');
    search(`subject:${genre}`);
    navigate(`/explore?filter=genre&genre=${encodeURIComponent(genre)}`);
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    search(query);
    navigate(`/explore?q=${encodeURIComponent(query)}`);
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 300 && hasMore && !loading) {
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
            Explore Books
          </h1>
          
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-l-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" 
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
          </form>
          
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden flex items-center py-2 px-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
        
        {/* Recent searches display */}
        {recentSearches.length > 0 && !searchQuery && !selectedGenre && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Recent Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 5).map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(query)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar - desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <h2 className="font-medium text-lg text-gray-900 dark:text-white mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {FEATURED_GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreSelect(genre)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedGenre === genre
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile filters */}
          {filtersOpen && (
            <div className="md:hidden fixed inset-0 bg-gray-900/50 dark:bg-black/50 z-40 animate-fade-in">
              <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-white dark:bg-gray-900 p-4 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-medium text-lg text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <X size={18} />
                  </button>
                </div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {FEATURED_GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        handleGenreSelect(genre);
                        setFiltersOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedGenre === genre
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Main content */}
          <div className="flex-1">
            {/* Mobile genres scroll */}
            <div className="md:hidden overflow-x-auto pb-4 mb-6 flex gap-2 scrollbar-hide">
              {FEATURED_GENRES.map((genre) => (
                <GenreTab
                  key={genre}
                  genre={genre}
                  isSelected={selectedGenre === genre}
                  onClick={() => handleGenreSelect(genre)}
                />
              ))}
            </div>
            
            {/* Results info */}
            <div className="mb-6">
              {loading && books.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Searching for books...
                </p>
              ) : error ? (
                <p className="text-error-600 dark:text-error-500">
                  {error}
                </p>
              ) : books.length > 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Found {totalItems.toLocaleString()} books
                  {searchQuery ? ` for "${searchQuery}"` : ""}
                  {selectedGenre ? ` in ${selectedGenre}` : ""}
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No results found. Try a different search term.
                </p>
              )}
            </div>
            
            {/* Books grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onClick={() => handleBookClick(book.id)} 
                />
              ))}
              
              {/* Loading placeholders */}
              {loading && books.length > 0 && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <div key={`loading-${i}`} className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-2"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4 mb-2"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            {/* Load more */}
            {hasMore && !loading && books.length > 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
            
            {/* Loading indicator */}
            {loading && books.length > 0 && (
              <div className="text-center mt-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;