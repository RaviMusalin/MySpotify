import React from 'react';
import './Playlist.css';
import Track from '../Track/Track'; // adjust the path if needed

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
        <div className="TrackList">
          {tracks.map((track) => (
            <Track key={track.id} track={track} onRemove={onRemove} />
          ))}
        </div>
      ) : (
        <p>No tracks added yet.</p>
      )}
      <button className="PlaylistButton" onClick={onSave}>Save Playlist</button>
    </div>
  );
}

export default Playlist;
