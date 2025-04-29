import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Explore from './components/Explore';
import BookDetails from './components/BookDetails';
import Favorites from './components/Favorites';
import ReadingLists from './components/ReadingLists';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has previously set a preference
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }
    // Otherwise check for system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const handleSearch = (query: string) => {
    // This will be handled in the Header component via navigation
    window.location.href = `/explore?q=${encodeURIComponent(query)}`;
  };
  
  return (
    <BookProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header 
            onSearch={handleSearch} 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
          />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/reading-lists" element={<ReadingLists />} />
              {/* Redirect any other routes to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </BrowserRouter>
    </BookProvider>
  );
};

export default App;