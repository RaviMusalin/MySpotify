import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Spotify from './util/Spotify';

// Callback component to handle Spotify redirect
function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the access token from the URL (Spotify.getAccessToken should handle this)
    const token = Spotify.getAccessToken();
    if (token) {
      // Save the token to localStorage
      localStorage.setItem('spotifyToken', token);
      navigate('/'); // Redirect to home
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

// Home component to display content when the user is logged in
function Home() {
  const token = localStorage.getItem('spotifyToken'); // Get the token from localStorage

  // If there's no token, redirect the user to the login page (Spotify auth)
  if (!token) {
    window.location.href = Spotify.getAuthURL(); // Use the method from Spotify utility
  }

  return (
    <div>
      <h1>Welcome to the Spotify App!</h1>
      <p>You are now authenticated and can start using the app.</p>
      {}
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