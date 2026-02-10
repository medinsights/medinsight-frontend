// frontend/src/components/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "🔍 Rechercher un patient..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <button className="clear-button" onClick={handleClear}>
            ❌
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="search-hint">
          Recherche : "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;