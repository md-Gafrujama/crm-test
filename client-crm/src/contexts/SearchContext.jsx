// src/contexts/SearchContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

// Create context
const SearchContext = createContext();

// Provider component
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search update (300ms delay)
  const updateSearchTerm = useCallback((term) => {
    const timer = setTimeout(() => {
      setSearchTerm(term.toLowerCase().trim());
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SearchContext.Provider value={{ searchTerm, updateSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for easy access
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Prop types validation
SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};