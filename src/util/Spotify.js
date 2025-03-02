const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const Spotify = {
  // Get the access token from localStorage or URL parameters (OAuth Flow)
  getAccessToken: function () {
    // First, try to get the token from localStorage
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      return storedToken;  // Return the token from localStorage if found
    }

    // If the token is not in localStorage, check the URL (callback route)
    const urlParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const token = urlParams.get('access_token');
    
    if (token) {
      // If the token is in the URL, save it to localStorage and return it
      localStorage.setItem('spotify_access_token', token);
      return token;
    }

    // If there's no token, trigger the authentication process
    this.authenticate();
    return null;
  },

  // Redirect the user to Spotify's login page to authenticate
  authenticate: function () {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=playlist-modify-public playlist-modify-private user-library-read user-read-private&state=34fhsf94fhs09dhf`;
    window.location = authUrl;
  },

  // Example search function to find tracks, albums, artists
  search: function (query) {
    const token = this.getAccessToken();
    if (!token) return;

    return fetch(`https://api.spotify.com/v1/search?q=${query}&type=track,album,artist&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  // Save a playlist to the user's account
  savePlaylist: function (name, trackURIs) {
    if (!name || !trackURIs.length) return;

    const token = this.getAccessToken();
    if (!token) return;

    return fetch('https://api.spotify.com/v1/me/top/artists', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        uris: trackURIs,
      }),
    }).then((response) => response.json());
  },
};

export default Spotify;
