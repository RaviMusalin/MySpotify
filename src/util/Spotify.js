const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
let accessToken = '';

const Spotify = {
  getAuthURL() {
    const scope = "playlist-modify-public playlist-modify-private";
    return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  },

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Clear the token after expiration
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    }

    console.log("🔑 No token found, redirecting to login...");
    window.location.href = Spotify.getAuthURL();
    return "";
  },

  async search(term) {
    const token = Spotify.getAccessToken();
    if (!token) return [];

    console.log(`🔎 Searching Spotify API for: ${term}`);
    
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} - ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      console.log("🔍 API Response Data:", data);
      if (!data.tracks) return [];

      return data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        albumImage: track.album.images[0]?.url, // ✅ Fetch album image
        uri: track.uri, // ✅ Fetch track URI for saving
      }));
    } catch (error) {
      console.error("⚠️ Error fetching data from Spotify:", error);
      return [];
    }
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return false;

    const token = Spotify.getAccessToken();
    if (!token) return false;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Step 1: Get User ID
    const userResponse = await fetch("https://api.spotify.com/v1/me", { headers });
    const userData = await userResponse.json();
    if (!userData.id) return false;
    const userId = userData.id;

    // Step 2: Create a Playlist
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ name }),
      }
    );
    const playlistData = await playlistResponse.json();
    if (!playlistData.id) return false;
    const playlistId = playlistData.id;

    // Step 3: Add Tracks to the Playlist
    const addTracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ uris: trackUris }),
      }
    );

    return addTracksResponse.ok;
  },
};

export default Spotify;
