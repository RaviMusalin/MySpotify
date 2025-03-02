import React, { useState } from 'react';
import './SearchBar.css'; 


const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='search-container'>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Search for a song, album, or artist"
      />
      <button onClick={handleSearch} className='search-button'>Search</button>
    </div>
  );
};

export default SearchBar;
