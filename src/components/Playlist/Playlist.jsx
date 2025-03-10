import React from 'react';
import './Playlist.css'

function Playlist({ name, tracks, onRemove, onNameChange, onSave }) {
    return (
      <div className="Playlist">
        <h2>Your Playlist</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter playlist name"
        />
        {tracks.length > 0 ? (
          <ul>
            {tracks.map((track) => (
              <li key={track.id}>
                <img src={track.albumImage} alt={track.name} style={{ width: '100px', height: '100px' }} />
                {track.name} by {track.artist}
                <button onClick={() => onRemove(track)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tracks added yet.</p>
        )}
        <button onClick={onSave}>Save Playlist</button>
      </div>
    );
  }
  
  export default Playlist;