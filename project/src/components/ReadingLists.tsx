import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, ChevronRight, Trash2, BookCopy } from 'lucide-react';
import { Book, ReadingList } from '../types';
import { useBooks } from '../context/BookContext';
import { getBookById } from '../services/api';
import BookCard from './BookCard';

const ReadingLists: React.FC = () => {
  const navigate = useNavigate();
  const { readingLists, createReadingList, deleteReadingList } = useBooks();
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [listBooks, setListBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch books for the selected reading list
  useEffect(() => {
    if (!selectedList) {
      setListBooks([]);
      return;
    }
    
    const selectedListData = readingLists.find(list => list.id === selectedList);
    if (!selectedListData || selectedListData.books.length === 0) {
      setListBooks([]);
      return;
    }
    
    const fetchListBooks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const bookPromises = selectedListData.books.map(bookId => getBookById(bookId));
        const books = await Promise.all(bookPromises);
        
        // Filter out null values (failed fetches)
        const validBooks = books.filter(book => book !== null) as Book[];
        setListBooks(validBooks);
      } catch (err) {
        console.error('Error fetching reading list books:', err);
        setError('Failed to load books in this reading list');
      } finally {
        setLoading(false);
      }
    };
    
    fetchListBooks();
  }, [selectedList, readingLists]);
  
  const handleCreateList = () => {
    const listName = prompt('Enter a name for your new reading list:');
    if (listName?.trim()) {
      createReadingList(listName.trim());
    }
  };
  
  const handleDeleteList = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this reading list?')) {
      deleteReadingList(listId);
      if (selectedList === listId) {
        setSelectedList(null);
      }
    }
  };
  
  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };
  
  const selectedListData = selectedList 
    ? readingLists.find(list => list.id === selectedList)
    : null;
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
            Reading Lists
          </h1>
          <button
            onClick={handleCreateList}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Create New List
          </button>
        </div>
        
        {readingLists.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <BookOpen size={64} className="text-gray-300 dark:text-gray-700" />
            </div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No reading lists yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first reading list to organize your books
            </p>
            <button 
              onClick={handleCreateList}
              className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors flex items-center mx-auto"
            >
              <Plus size={18} className="mr-2" />
              Create Reading List
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Reading Lists Sidebar */}
            <div className="md:w-1/3 lg:w-1/4">
              <h2 className="font-medium text-lg text-gray-900 dark:text-white mb-4">
                Your Lists
              </h2>
              <div className="space-y-3">
                {readingLists.map((list) => (
                  <div
                    key={list.id}
                    onClick={() => setSelectedList(list.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedList === list.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                        : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {list.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {list.books.length} {list.books.length === 1 ? 'book' : 'books'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Updated {new Date(list.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteList(list.id, e)}
                        className="p-1 text-gray-400 hover:text-error-500 transition-colors"
                        aria-label="Delete list"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Created {new Date(list.dateCreated).toLocaleDateString()}
                      </span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Selected List Content */}
            <div className="md:w-2/3 lg:w-3/4">
              {selectedList ? (
                <>
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedListData?.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedListData?.books.length} {selectedListData?.books.length === 1 ? 'book' : 'books'} in this list
                    </p>
                  </div>
                  
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
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
                  ) : listBooks.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                      <div className="flex justify-center mb-4">
                        <BookCopy size={48} className="text-gray-300 dark:text-gray-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        This list is empty
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Add books to this list from book detail pages
                      </p>
                      <button 
                        onClick={() => navigate('/explore')}
                        className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                      >
                        Explore Books
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {listBooks.map((book) => (
                        <BookCard 
                          key={book.id} 
                          book={book} 
                          onClick={() => handleBookClick(book.id)} 
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a reading list to view its books
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingLists;