import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Search } from 'lucide-react';
import { Book } from '../types';
import { useBooks } from '../context/BookContext';
import { getBookById } from '../services/api';
import BookCard from './BookCard';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useBooks();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const bookPromises = favorites.map(fav => getBookById(fav.id));
        const books = await Promise.all(bookPromises);
        
        // Filter out null values (failed fetches)
        const validBooks = books.filter(book => book !== null) as Book[];
        setFavoriteBooks(validBooks);
      } catch (err) {
        console.error('Error fetching favorite books:', err);
        setError('Failed to load your favorite books');
      } finally {
        setLoading(false);
      }
    };
    
    if (favorites.length > 0) {
      fetchFavoriteBooks();
    } else {
      setFavoriteBooks([]);
      setLoading(false);
    }
  }, [favorites]);
  
  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };
  
  const handleRemoveFavorite = (bookId: string) => {
    removeFromFavorites(bookId);
  };
  
  const filteredBooks = searchQuery
    ? favoriteBooks.filter(book => 
        book.volumeInfo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.volumeInfo.authors && book.volumeInfo.authors.some(author => 
          author.toLowerCase().includes(searchQuery.toLowerCase()))))
    : favoriteBooks;
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Your Favorites
        </h1>
        
        {favorites.length > 0 && (
          <div className="mb-8 relative">
            <input
              type="text"
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/2 lg:w-1/3 py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" 
            />
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 p-4 rounded-lg">
            {error}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <Heart size={64} className="text-gray-300 dark:text-gray-700" />
            </div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Books you add to your favorites will appear here
            </p>
            <button 
              onClick={() => navigate('/explore')}
              className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              Explore Books
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <Search size={48} className="text-gray-300 dark:text-gray-700" />
            </div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No matches found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              No books match your search "{searchQuery}"
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You have {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} in your favorites
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onClick={() => handleBookClick(book.id)} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;