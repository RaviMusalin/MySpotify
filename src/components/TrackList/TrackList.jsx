// TrackList.jsx
import React from 'react';

function TrackList({ tracks, onAdd }) {
  const handleAdd = (track) => {
    onAdd(track); // Calling onAdd when the track is added
  };

  return (
    <div>
      {tracks.map((track) => (
        <div key={track.id}>
          <p>{track.name} by {track.artist}</p>
          <button onClick={() =>  handleAdd(track)}>Add to Playlist</button>
        </div>
      ))}
    </div>
  );
}

export default TrackList;
