// src/components/SearchResults.jsx
import React from 'react';
// import './SearchResults.css'; 


const SearchResults = ({ results }) => {
  return (
    <div>
      <h2>Search Results</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((track) => (
            <li key={track.id}>
              <p>{track.name}</p>
              <p>{track.artist}</p>
              <p>{track.album}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;