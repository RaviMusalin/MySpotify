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
      <SearchBar setSearchResults={setSearchResults} />
      <SearchResults results={searchResults} onAdd={onAdd} />
    </div>
  );
}

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    console.log(`Executing search for: ${query}`);
    const results = await Spotify.search(query);
    console.log("Received search results:", results); // ✅ Check if results exist

    if (results && results.length > 0) {
      setSearchResults(results);
    } else {
      console.log("No search results received.");
    }
  };


  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <SearchResults results={searchResults} />
    </div>
  );
}

export default App;