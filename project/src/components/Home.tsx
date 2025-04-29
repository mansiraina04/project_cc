import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ChevronRight, Sparkles } from 'lucide-react';
import { Book as BookType } from '../types';
import { useBooks } from '../context/BookContext';
import { getTrendingBooks, getBooksByGenre } from '../services/api';
import BookCard from './BookCard';
import GenreTab from './GenreTab';

const FEATURED_GENRES = [
  'Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { recentlyViewed } = useBooks();
  const [trendingBooks, setTrendingBooks] = useState<BookType[]>([]);
  const [genreBooks, setGenreBooks] = useState<BookType[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>(FEATURED_GENRES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch trending books on component mount
  useEffect(() => {
    const fetchTrendingBooks = async () => {
      setIsLoading(true);
      try {
        const result = await getTrendingBooks(8);
        if (result.items) {
          setTrendingBooks(result.items);
        }
      } catch (error) {
        console.error('Error fetching trending books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  // Fetch books by genre when the selected genre changes
  useEffect(() => {
    const fetchGenreBooks = async () => {
      setIsLoading(true);
      try {
        const result = await getBooksByGenre(selectedGenre, 8);
        if (result.items) {
          setGenreBooks(result.items);
        }
      } catch (error) {
        console.error(`Error fetching ${selectedGenre} books:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenreBooks();
  }, [selectedGenre]);

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20 px-4 md:py-32 mb-16">
        <div className="container mx-auto max-w-4xl">
          <div className="relative z-10">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Your Next <br />
              <span className="text-accent-400">Favorite Book</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-100">
              Personalized recommendations based on your reading preferences. 
              Explore new worlds, ideas, and perspectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/explore')}
                className="px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Sparkles size={18} className="mr-2" />
                Explore Books
              </button>
              <button 
                onClick={() => navigate('/reading-lists')}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-full transition-colors border border-white/30 flex items-center justify-center"
              >
                <Book size={18} className="mr-2" />
                Create Reading List
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 hidden lg:block w-1/3 opacity-10">
            <div className="w-full h-full bg-[url('https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"></div>
          </div>
        </div>
      </section>

      {/* Trending Books Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Trending Books
          </h2>
          <button 
            onClick={() => navigate('/explore?filter=trending')}
            className="text-primary-600 dark:text-primary-400 font-medium flex items-center hover:underline"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {trendingBooks.slice(0, 4).map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onClick={() => handleBookClick(book.id)} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Genre Tabs Section */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Browse by Genre
        </h2>

        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
          {FEATURED_GENRES.map((genre) => (
            <GenreTab
              key={genre}
              genre={genre}
              isSelected={selectedGenre === genre}
              onClick={() => handleGenreChange(genre)}
            />
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {genreBooks.slice(0, 4).map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onClick={() => handleBookClick(book.id)} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed Section - Only shown if there are recently viewed books */}
      {recentlyViewed.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Recently Viewed
            </h2>
            <button 
              onClick={() => navigate('/history')}
              className="text-primary-600 dark:text-primary-400 font-medium flex items-center hover:underline"
            >
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onClick={() => handleBookClick(book.id)} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;