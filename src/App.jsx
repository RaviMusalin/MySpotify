import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Spotify from './util/Spotify';
import SearchBar from './components/Search/SearchBar';
import SearchResults from './components/Search/SearchResults';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Spotify.getAccessToken();
    if (token) {
      localStorage.setItem('spotifyToken', token);
      navigate('/');
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

function Home() {
  const token = localStorage.getItem('spotifyToken');
  const [searchResults, setSearchResults] = useState([]);  // Holds search results
  const [playlistTracks, setPlaylistTracks] = useState([]); // Holds added tracks

  if (!token) {
    window.location.href = Spotify.getAuthURL();
  }

  // Function to add a track to the playlist
  function onAdd(track) {
    if (!playlistTracks.some((t) => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  }

  return (
    <div>
      <h1>Welcome to the Spotify App!</h1>
      <SearchBar onSearch={setSearchResults} />
      <SearchResults results={searchResults} onAdd={onAdd} />
      <div>
        <h2>Your Playlist</h2>
        {playlistTracks.length > 0 ? (
          <ul>
            {playlistTracks.map((track) => (
              <li key={track.id}>
                {track.name} by {track.artist}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tracks added yet.</p>
        )}
      </div>
    </div>
  );
}

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]); // Tracks in the playlist

  // Handle the search functionality
  const handleSearch = async (query) => {
    const results = await Spotify.search(query);
    console.log("Received search results:", results);

    if (results && results.length > 0) {
      setSearchResults(results);
    } else {
      console.log("No search results received.");
    }
  };

  // Function to add a track to the playlist
  function onAdd(track) {
    if (!playlistTracks.some((t) => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <SearchResults results={searchResults} onAdd={onAdd} />
      <div>
        <h2>Your Playlist</h2>
        {playlistTracks.length > 0 ? (
          <ul>
            {playlistTracks.map((track) => (
              <li key={track.id}>
                {track.name} by {track.artist}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tracks added yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;