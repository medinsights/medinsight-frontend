// frontend/src/components/common/SearchBar.jsx
/**
 * COMPOSANT RÉUTILISABLE - Barre de Recherche avec Filtres
 * 
 * Utilisé par: Consultations, Traitements, Analyses
 */

import React, { useState } from 'react';
import './Searchbar.css';

const SearchBar = ({ 
  placeholder = "Rechercher...",
  onSearch,
  filters = [],
  showFilters = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Recherche en temps réel
    if (onSearch) {
      onSearch({
        term: value,
        filters: activeFilters
      });
    }
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: value
    };
    
    setActiveFilters(newFilters);
    
    if (onSearch) {
      onSearch({
        term: searchTerm,
        filters: newFilters
      });
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    
    if (onSearch) {
      onSearch({
        term: '',
        filters: {}
      });
    }
  };

  const activeFilterCount = Object.keys(activeFilters).filter(
    key => activeFilters[key] && activeFilters[key] !== ''
  ).length;

  return (
    <div className="search-bar-container">
      <div className="search-bar-main">
        {/* Input de recherche */}
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm('');
                handleSearchChange({ target: { value: '' } });
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Bouton Filtres */}
        {showFilters && filters.length > 0 && (
          <button
            className={`filters-toggle-btn ${activeFilterCount > 0 ? 'active' : ''}`}
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <span className="filter-icon">🔽</span>
            <span>Filtres</span>
            {activeFilterCount > 0 && (
              <span className="filter-count-badge">{activeFilterCount}</span>
            )}
          </button>
        )}

        {/* Bouton Clear */}
        {(searchTerm || activeFilterCount > 0) && (
          <button className="clear-all-btn" onClick={clearFilters}>
            ✕ Tout effacer
          </button>
        )}
      </div>

      {/* Menu des filtres */}
      {showFilterMenu && filters.length > 0 && (
        <div className="filters-menu">
          {filters.map((filter, index) => (
            <div key={index} className="filter-item">
              <label className="filter-label">{filter.label}</label>
              
              {filter.type === 'select' && (
                <select
                  className="filter-select"
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                >
                  <option value="">Tous</option>
                  {filter.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {filter.type === 'date' && (
                <input
                  type="date"
                  className="filter-date"
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              )}

              {filter.type === 'daterange' && (
                <div className="filter-daterange">
                  <input
                    type="date"
                    className="filter-date"
                    placeholder="Du"
                    value={activeFilters[`${filter.key}_start`] || ''}
                    onChange={(e) => handleFilterChange(`${filter.key}_start`, e.target.value)}
                  />
                  <span className="daterange-separator">→</span>
                  <input
                    type="date"
                    className="filter-date"
                    placeholder="Au"
                    value={activeFilters[`${filter.key}_end`] || ''}
                    onChange={(e) => handleFilterChange(`${filter.key}_end`, e.target.value)}
                  />
                </div>
              )}

              {filter.type === 'checkbox' && (
                <div className="filter-checkboxes">
                  {filter.options.map((option, idx) => (
                    <label key={idx} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={
                          activeFilters[filter.key]?.includes(option.value) || false
                        }
                        onChange={(e) => {
                          const current = activeFilters[filter.key] || [];
                          const newValue = e.target.checked
                            ? [...current, option.value]
                            : current.filter(v => v !== option.value);
                          handleFilterChange(filter.key, newValue);
                        }}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;