import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Favorite, ReadingList } from '../types';

interface BookContextType {
  favorites: Favorite[];
  readingLists: ReadingList[];
  recentSearches: string[];
  recentlyViewed: Book[];
  addToFavorites: (book: Book) => void;
  removeFromFavorites: (id: string) => void;
  isBookFavorited: (id: string) => boolean;
  createReadingList: (name: string) => void;
  deleteReadingList: (id: string) => void;
  addBookToReadingList: (bookId: string, listId: string) => void;
  removeBookFromReadingList: (bookId: string, listId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  addRecentlyViewed: (book: Book) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

// Local storage keys
const FAVORITES_STORAGE_KEY = 'book_favorites';
const READING_LISTS_STORAGE_KEY = 'book_reading_lists';
const RECENT_SEARCHES_STORAGE_KEY = 'book_recent_searches';
const RECENTLY_VIEWED_STORAGE_KEY = 'book_recently_viewed';

interface BookProviderProps {
  children: ReactNode;
}

export const BookProvider = ({ children }: BookProviderProps) => {
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  
  const [readingLists, setReadingLists] = useState<ReadingList[]>(() => {
    const storedLists = localStorage.getItem(READING_LISTS_STORAGE_KEY);
    return storedLists ? JSON.parse(storedLists) : [];
  });
  
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    return storedSearches ? JSON.parse(storedSearches) : [];
  });
  
  const [recentlyViewed, setRecentlyViewed] = useState<Book[]>(() => {
    const storedViewed = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    return storedViewed ? JSON.parse(storedViewed) : [];
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    localStorage.setItem(READING_LISTS_STORAGE_KEY, JSON.stringify(readingLists));
  }, [readingLists]);
  
  useEffect(() => {
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);
  
  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Favorites management
  const addToFavorites = (book: Book) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === book.id)) return prev;
      return [...prev, { id: book.id, dateAdded: new Date().toISOString() }];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const isBookFavorited = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  // Reading lists management
  const createReadingList = (name: string) => {
    const newList: ReadingList = {
      id: `list_${Date.now()}`,
      name,
      books: [],
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setReadingLists(prev => [...prev, newList]);
  };

  const deleteReadingList = (id: string) => {
    setReadingLists(prev => prev.filter(list => list.id !== id));
  };

  const addBookToReadingList = (bookId: string, listId: string) => {
    setReadingLists(prev => 
      prev.map(list => {
        if (list.id === listId && !list.books.includes(bookId)) {
          return {
            ...list,
            books: [...list.books, bookId],
            lastModified: new Date().toISOString(),
          };
        }
        return list;
      })
    );
  };

  const removeBookFromReadingList = (bookId: string, listId: string) => {
    setReadingLists(prev => 
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            books: list.books.filter(id => id !== bookId),
            lastModified: new Date().toISOString(),
          };
        }
        return list;
      })
    );
  };

  // Recent searches management
  const addRecentSearch = (query: string) => {
    // Don't add empty queries or duplicates
    if (!query.trim() || recentSearches.includes(query)) return;
    
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(s => s !== query)];
      return updated.slice(0, 10); // Limit to 10 recent searches
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Recently viewed books management
  const addRecentlyViewed = (book: Book) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(b => b.id !== book.id);
      const updated = [book, ...filtered];
      return updated.slice(0, 20); // Limit to 20 recently viewed books
    });
  };

  const value = {
    favorites,
    readingLists,
    recentSearches,
    recentlyViewed,
    addToFavorites,
    removeFromFavorites,
    isBookFavorited,
    createReadingList,
    deleteReadingList,
    addBookToReadingList,
    removeBookFromReadingList,
    addRecentSearch,
    clearRecentSearches,
    addRecentlyViewed,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};