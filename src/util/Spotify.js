const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

let accessToken = '';

const Spotify = {
  getAccessToken: function() {
    // Check if we already have a valid token
    if (accessToken) {
      return accessToken;
    }

    // If not, attempt to retrieve the token from URL parameters (OAuth Flow)
    const urlParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const token = urlParams.get('access_token');
    
    if (token) {
      accessToken = token;
      return accessToken;
    }

    // If no token is found, the user needs to authenticate
    this.authenticate();
    return null;
  },

  authenticate: function() {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=playlist-modify-public playlist-modify-private user-library-read user-read-private&state=34fhsf94fhs09dhf`;
    window.location = authUrl;
  },

  search: function(query) { 
    const token = this.getAccessToken();
    if (!token) return;

    return fetch(`https://api.spotify.com/v1/search?q=${query}&type=track,album,artist&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        return data.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      });
  },

  savePlaylist: function(name, trackURIs) {
    if (!name || !trackURIs.length) return;

    const token = this.getAccessToken();
    if (!token) return;

    return fetch('https://api.spotify.com/v1/me/top/artists', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        uris: trackURIs
      })
    }).then(response => response.json());
  }
};

export default Spotify;