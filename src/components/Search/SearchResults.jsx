import React from 'react';
import './SearchResults.css';  // Make sure the path to your CSS file is correct
import TrackList from '../TrackList/TrackList';  // Import TrackList component

function SearchResults({ results, onAdd }) {
  console.log("Rendering SearchResults with:", results);

  return (  
    <div className="SearchResults">
      <h2>Search Results</h2>
      {results.length > 0 ? (
        <TrackList tracks={results}/>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}

export default SearchResults;
