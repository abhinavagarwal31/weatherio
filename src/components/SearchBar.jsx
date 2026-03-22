import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, isLoading }) {
  // Controlled input using useState
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <section className="search-section">
      <form className="search-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            id="cityInput"
            className="search-input"
            placeholder="Search any city..."
            aria-label="City name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
          <button
            type="submit"
            className="search-btn"
            id="searchBtn"
            aria-label="Search weather"
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}

export default SearchBar;
