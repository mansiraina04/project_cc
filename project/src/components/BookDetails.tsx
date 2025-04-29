import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ArrowLeft, 
  ExternalLink, 
  Bookmark, 
  Star, 
  Calendar, 
  Layers, 
  Globe, 
  Share2
} from 'lucide-react';
import { getBookById } from '../services/api';
import { Book } from '../types';
import { useBooks } from '../context/BookContext';

const DEFAULT_COVER = 'https://images.pexels.com/photos/4238498/pexels-photo-4238498.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingListOpen, setReadingListOpen] = useState(false);
  
  const { 
    addToFavorites, 
    removeFromFavorites, 
    isBookFavorited,
    readingLists,
    addBookToReadingList,
    createReadingList,
    addRecentlyViewed
  } = useBooks();
  
  useEffect(() => {
    if (!id) return;
    
    const fetchBookDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const bookData = await getBookById(id);
        if (bookData) {
          setBook(bookData);
          addRecentlyViewed(bookData);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookDetails();
  }, [id, addRecentlyViewed]);
  
  if (!id) {
    return <div>Invalid book ID</div>;
  }
  
  if (isLoading) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {error || 'Book not found'}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const {
    volumeInfo: {
      title,
      authors,
      publisher,
      publishedDate,
      description,
      pageCount,
      categories,
      averageRating,
      ratingsCount,
      imageLinks,
      language,
      previewLink,
      infoLink
    },
    saleInfo
  } = book;
  
  const coverImage = imageLinks?.thumbnail || DEFAULT_COVER;
  const isFavorited = isBookFavorited(id);
  
  const toggleFavorite = () => {
    if (isFavorited) {
      removeFromFavorites(id);
    } else {
      addToFavorites(book);
    }
  };
  
  const handleAddToReadingList = (listId: string) => {
    addBookToReadingList(id, listId);
    setReadingListOpen(false);
  };
  
  const handleCreateNewList = () => {
    const listName = prompt('Enter a name for your new reading list:');
    if (listName?.trim()) {
      createReadingList(listName.trim());
      // Get the newly created list and add the book to it
      // This is a bit of a hack, but it works for now
      setTimeout(() => {
        const newList = readingLists[readingLists.length - 1];
        if (newList) {
          addBookToReadingList(id, newList.id);
        }
      }, 100);
      setReadingListOpen(false);
    }
  };
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to results</span>
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book cover */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="sticky top-24">
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-800">
                <img
                  src={coverImage}
                  alt={`Cover of ${title}`}
                  className="w-full object-cover"
                />
              </div>
              
              {/* Action buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium transition-colors ${
                    isFavorited
                      ? 'bg-error-500 text-white hover:bg-error-600'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Heart size={18} className={`mr-2 ${isFavorited ? 'fill-white' : ''}`} />
                  {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setReadingListOpen(!readingListOpen)}
                    className="w-full py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center font-medium transition-colors"
                  >
                    <Bookmark size={18} className="mr-2" />
                    Add to Reading List
                  </button>
                  
                  {readingListOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-20 p-3 animate-fade-in">
                      {readingLists.length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          You don't have any reading lists yet.
                        </p>
                      ) : (
                        <div className="mb-3 max-h-48 overflow-y-auto">
                          {readingLists.map(list => (
                            <button
                              key={list.id}
                              onClick={() => handleAddToReadingList(list.id)}
                              className="w-full text-left py-2 px-3 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {list.name}
                            </button>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={handleCreateNewList}
                        className="w-full py-2 px-3 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        + Create new list
                      </button>
                    </div>
                  )}
                </div>
                
                {previewLink && (
                  <a
                    href={previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center font-medium transition-colors"
                  >
                    <ExternalLink size={18} className="mr-2" />
                    Preview Book
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Book details */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Title and author */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            
            {authors && authors.length > 0 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                by {authors.join(', ')}
              </p>
            )}
            
            {/* Rating */}
            {averageRating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={20}
                      className={`${
                        index < Math.floor(averageRating)
                          ? 'text-accent-500 fill-accent-500'
                          : index < averageRating
                          ? 'text-accent-500 fill-accent-500 opacity-50'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {averageRating.toFixed(1)}
                </span>
                {ratingsCount && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({ratingsCount.toLocaleString()} ratings)
                  </span>
                )}
              </div>
            )}
            
            {/* Book info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {publishedDate && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar size={16} className="text-primary-600 dark:text-primary-400 mr-2" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Published</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {publishedDate}
                  </p>
                </div>
              )}
              
              {publisher && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Bookmark size={16} className="text-primary-600 dark:text-primary-400 mr-2" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Publisher</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {publisher}
                  </p>
                </div>
              )}
              
              {pageCount && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Layers size={16} className="text-primary-600 dark:text-primary-400 mr-2" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Pages</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pageCount}
                  </p>
                </div>
              )}
              
              {language && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Globe size={16} className="text-primary-600 dark:text-primary-400 mr-2" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Language</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language.toUpperCase()}
                  </p>
                </div>
              )}
            </div>
            
            {/* Description */}
            {description && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Description
                </h2>
                <div 
                  className="prose dark:prose-invert max-w-none" 
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )}
            
            {/* Categories */}
            {categories && categories.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Buy links */}
            {saleInfo?.buyLink && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Buy This Book
                </h2>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={saleInfo.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Buy Now
                    {saleInfo.retailPrice && (
                      <span className="ml-2">
                        (${saleInfo.retailPrice.amount.toFixed(2)})
                      </span>
                    )}
                  </a>
                </div>
              </div>
            )}
            
            {/* Share buttons */}
            <div className="mt-12 flex items-center">
              <span className="text-gray-600 dark:text-gray-400 mr-4">Share this book:</span>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;