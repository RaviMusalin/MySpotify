import React from 'react';

const TrackList = ({ tracks, onAdd }) => {
  return (
    <ul>
      {tracks.map((track) => (
        <li key={track.id}>
          <p>{track.name}</p>
          <p>{track.artist}</p>
          <p>{track.album}</p>
          {/* Optionally add button to add track */}
          <button onClick={() => onAdd(track)}>Add</button>
        </li>
      ))}
    </ul>
  );
};

export default TrackList;
