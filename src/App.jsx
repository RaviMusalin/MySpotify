import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Spotify from './util/Spotify';

// Callback component to handle Spotify redirect
function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the access token from the URL
    const token = Spotify.getAccessToken();
    if (token) {
      // Save the token to localStorage or state
      localStorage.setItem('spotifyToken', token);
      navigate('/');
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

// Home component to display content when user is logged in
function Home() {
  const token = localStorage.getItem('spotifyToken'); // Get the token from localStorage

  // If there's no token, redirect the user to login page (Spotify auth)
  if (!token) {
    window.location.href = 'https://accounts.spotify.com/authorize?...'; // Replace with the Spotify auth URL
  }

  return (
    <div>
      <h1>Welcome to the Spotify App!</h1>
      <p>You are now authenticated and can start using the app.</p>
      {/* Add more components like SearchBar, Playlist, etc. */}
    </div>
  );
}

function App() {
  const token = localStorage.getItem('spotifyToken'); // Check if the token exists

  return (
    <Router>
      <Routes>
        {/* Route for Spotify OAuth callback */}
        <Route path="/callback" element={<Callback />} />
        
        {/* Home route */}
        <Route path="/" element={token ? <Home /> : <div>Loading...</div>} />
      </Routes>
    </Router>
  );
}

export default App;
