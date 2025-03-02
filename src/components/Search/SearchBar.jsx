import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Search button clicked with query:', query); // Debugging log
    onSearch(query); 
  };

  return (
    <div className="SearchBar">
      <input 
        type="text" 
        placeholder="Enter a song, artist, or album" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
