import React from 'react';
import { Heart, Bookmark, ExternalLink, Star } from 'lucide-react';
import { Book } from '../types';
import { useBooks } from '../context/BookContext';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const DEFAULT_COVER = 'https://images.pexels.com/photos/4238498/pexels-photo-4238498.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const { addToFavorites, removeFromFavorites, isBookFavorited } = useBooks();
  
  const {
    id,
    volumeInfo: {
      title,
      authors,
      imageLinks,
      averageRating,
      ratingsCount,
      description,
      categories
    }
  } = book;
  
  const isFavorited = isBookFavorited(id);
  
  const coverImage = imageLinks?.thumbnail || DEFAULT_COVER;
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorited) {
      removeFromFavorites(id);
    } else {
      addToFavorites(book);
    }
  };
  
  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.volumeInfo.previewLink) {
      window.open(book.volumeInfo.previewLink, '_blank');
    }
  };
  
  return (
    <div 
      className="group flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 h-full cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="relative pb-[140%] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img 
          src={coverImage}
          alt={`Cover of ${title}`}
          className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-0 inset-x-0 p-3 flex justify-between">
          <button 
            onClick={toggleFavorite}
            className="p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={18} className={isFavorited ? "fill-error-500 text-error-500" : ""} />
          </button>
          
          <button 
            onClick={handleExternalLink}
            className="p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
            aria-label="View book details"
          >
            <ExternalLink size={18} />
          </button>
        </div>
        
        {categories && categories.length > 0 && (
          <div className="absolute bottom-0 left-0 p-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-500 text-white rounded-md">
              {categories[0]}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-serif font-medium text-lg text-gray-900 dark:text-white line-clamp-2 mb-1">
          {title}
        </h3>
        
        {authors && authors.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {authors.join(', ')}
          </p>
        )}
        
        {averageRating && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={16} className="text-accent-500 fill-accent-500" />
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            {ratingsCount && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({ratingsCount.toLocaleString()})
              </span>
            )}
          </div>
        )}
        
        {description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mt-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;