import React from 'react';

interface GenreTabProps {
  genre: string;
  isSelected: boolean;
  onClick: () => void;
}

const GenreTab: React.FC<GenreTabProps> = ({ genre, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-medium transition-all ${
        isSelected 
          ? 'bg-primary-600 text-white shadow-md'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {genre}
    </button>
  );
};

export default GenreTab;