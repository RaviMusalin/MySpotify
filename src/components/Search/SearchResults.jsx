// SearchResults.jsx
import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

function SearchResults({ results, onAdd }) {
  if (results.length === 0) return null;

  return (  
    <div className="SearchResults">
      <h2>Search Results</h2>
      <div className="results-wrapper">
        <TrackList tracks={results} onAdd={onAdd} />
      </div>
    </div>
  );
}

export default SearchResults;
