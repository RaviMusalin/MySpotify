import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Spotify from './util/Spotify';
import SearchBar from './components/Search/SearchBar';
import SearchResults from './components/Search/SearchResults';
import Playlist from './components/Playlist/Playlist';

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

function App() {
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [playlistName, setPlaylistName] = useState("My Playlist"); // Playlist name
  const [playlistTracks, setPlaylistTracks] = useState([]); // Tracks added to the playlist
  const [backgroundIndex, setBackgroundIndex] = useState(0);


  useEffect(() => {
    const token = Spotify.getAccessToken();
    if (!token) {
      console.log("🔑 No token found, redirecting to login...");
      window.location.href = Spotify.getAuthURL();
    }
  }, []);

 

  // Handle the search functionality
  const handleSearch = async (query) => {
    const results = await Spotify.search(query);
    console.log('Received search results:', results);

    if (results?.length > 0) {
      setSearchResults(results);
    } else {
      console.log('No search results received.');
    }
  };

  // Function to add a track to the playlist
  function onAdd(track) {
    if (!playlistTracks.some((t) => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  }

  // Function to remove a track from the playlist
  function onRemove(track) {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
  }

  // Function to save the playlist to Spotify
  async function savePlaylist() {
    if (!playlistName || playlistTracks.length === 0) {
      alert("Please enter a playlist name and add at least one track.");
      return;
    }

    const trackUris = playlistTracks.map((track) => track.uri);
    const success = await Spotify.savePlaylist(playlistName, trackUris);

    if (success) {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
      alert("Playlist saved successfully!");
    } else {
      alert("There was an issue saving your playlist.");
    }
  }

  return (
    <div>
      <header className='header'>
        <h1 id="header-title">MySpotifyPlaylist</h1>
        <a href="https://open.spotify.com/" target='_blank'><img src="../images/logo_black.png" className='logo'/></a>
      </header>

      <div className="app-container">


      <div className="main-content">
  <SearchBar onSearch={handleSearch} />
  <SearchResults results={searchResults} onAdd={onAdd} />
</div>

<Playlist
  name={playlistName}
  tracks={playlistTracks}
  onRemove={onRemove}
  onNameChange={setPlaylistName}
  onSave={savePlaylist}
/>
    </div>
    </div>
  );
}

export default App;