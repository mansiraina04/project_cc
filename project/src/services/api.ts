import axios from 'axios';
import type { BookSearchParams, BookSearchResult, Book } from '../types';

const API_BASE_URL = 'https://www.googleapis.com/books/v1';
const DEFAULT_MAX_RESULTS = 20;

/**
 * Search for books using the Google Books API
 */
export const searchBooks = async (params: BookSearchParams): Promise<BookSearchResult> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/volumes`, {
      params: {
        q: params.q,
        startIndex: params.startIndex || 0,
        maxResults: params.maxResults || DEFAULT_MAX_RESULTS,
        orderBy: params.orderBy || 'relevance',
        ...(params.filter && { filter: params.filter }),
        ...(params.printType && { printType: params.printType }),
        ...(params.projection && { projection: params.projection }),
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error);
    return {
      kind: '',
      totalItems: 0,
      items: [],
    };
  }
};

/**
 * Get a specific book by ID
 */
export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/volumes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting book:', error);
    return null;
  }
};

/**
 * Get books by genre using category filter
 */
export const getBooksByGenre = async (genre: string, maxResults = DEFAULT_MAX_RESULTS): Promise<BookSearchResult> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/volumes`, {
      params: {
        q: `subject:${genre}`,
        maxResults,
        orderBy: 'relevance',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting books by genre:', error);
    return {
      kind: '',
      totalItems: 0,
      items: [],
    };
  }
};

/**
 * Get books by author
 */
export const getBooksByAuthor = async (author: string, maxResults = DEFAULT_MAX_RESULTS): Promise<BookSearchResult> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/volumes`, {
      params: {
        q: `inauthor:${author}`,
        maxResults,
        orderBy: 'relevance',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting books by author:', error);
    return {
      kind: '',
      totalItems: 0,
      items: [],
    };
  }
};

/**
 * Get trending/popular books
 * This is a simplified approach as Google Books API doesn't directly 
 * provide trending books, so we're using a predefined query
 */
export const getTrendingBooks = async (maxResults = DEFAULT_MAX_RESULTS): Promise<BookSearchResult> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/volumes`, {
      params: {
        q: 'subject:fiction',
        orderBy: 'newest',
        maxResults,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting trending books:', error);
    return {
      kind: '',
      totalItems: 0,
      items: [],
    };
  }
};