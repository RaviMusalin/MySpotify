const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
let accessToken = '';

const Spotify = {
  // Get the access token from localStorage or URL parameters (OAuth Flow)
  getAccessToken: function() {
    if (accessToken) {
        return accessToken;
    }

    const urlParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const token = urlParams.get('access_token');

    if (token) {
        accessToken = token;
        localStorage.setItem('spotifyToken', token); // Store the token
        return accessToken;
    }

    accessToken = localStorage.getItem('spotifyToken'); // Retrieve if stored before
    return accessToken;
},


  // Redirect the user to Spotify's login page to authenticate
  authenticate: function () {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=playlist-modify-public playlist-modify-private user-library-read user-read-private&state=34fhsf94fhs09dhf`;
    window.location = authUrl;
  },

  // Example search function to find tracks, albums, artists
  search: async function (query) { 
    let token = this.getAccessToken();
    
    if (!token) {
        console.error('No access token available. Redirecting to authenticate...');
        this.authenticate(); // Redirect for authentication if no token
        return [];
    }

    console.log(`Searching Spotify API for: ${query}`); // Debugging log

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,album,artist&limit=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error(`Error fetching data: ${response.status} - ${response.statusText}`);
            
            if (response.status === 401) {
                console.warn("Access token expired. Re-authenticating...");
                localStorage.removeItem('spotifyToken'); // Clear old token
                this.authenticate(); // Redirect to login
            }
            
            return [];
        }

        const data = await response.json();
        console.log('Spotify API Response:', data); // Debugging log

        if (!data.tracks) {
            console.error('No track data returned');
            return [];
        }

        return data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    } catch (error) {
        console.error('Error in search function:', error);
        return [];
    }
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
