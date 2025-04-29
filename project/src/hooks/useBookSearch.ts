import { useState, useEffect, useCallback } from 'react';
import { searchBooks } from '../services/api';
import { Book, BookSearchParams } from '../types';
import { useBooks } from '../context/BookContext';

interface UseBookSearchResult {
  books: Book[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  hasMore: boolean;
  search: (searchTerm: string, newSearch?: boolean) => void;
  loadMore: () => void;
}

export const useBookSearch = (): UseBookSearchResult => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<BookSearchParams>({ q: '' });
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { addRecentSearch } = useBooks();

  const search = useCallback((searchTerm: string, newSearch = true) => {
    if (!searchTerm.trim()) return;
    
    // Reset if this is a new search
    if (newSearch) {
      setBooks([]);
      setTotalItems(0);
    }
    
    setLoading(true);
    setError(null);
    
    const params: BookSearchParams = {
      q: searchTerm,
      startIndex: newSearch ? 0 : books.length,
      maxResults: 20,
    };
    
    setSearchParams(params);
    
    // Add to recent searches if this is a new search
    if (newSearch) {
      addRecentSearch(searchTerm);
    }
  }, [books.length, addRecentSearch]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore || !searchParams.q) return;
    
    search(searchParams.q, false);
  }, [loading, hasMore, searchParams.q, search]);

  useEffect(() => {
    if (!searchParams.q) return;
    
    const fetchBooks = async () => {
      try {
        const results = await searchBooks(searchParams);
        
        setBooks(prevBooks => {
          // If this is a new search, replace the books
          // If loading more, append to existing books
          return searchParams.startIndex === 0
            ? results.items || []
            : [...prevBooks, ...(results.items || [])];
        });
        
        setTotalItems(results.totalItems || 0);
        setHasMore(
          !!results.items && 
          results.items.length > 0 && 
          (searchParams.startIndex || 0) + results.items.length < results.totalItems
        );
      } catch (err) {
        setError('Failed to fetch books. Please try again.');
        console.error('Error in useBookSearch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams]);

  return {
    books,
    loading,
    error,
    totalItems,
    hasMore,
    search,
    loadMore,
  };
};