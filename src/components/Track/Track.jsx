import './Track.css';

function Track({ track, onAdd }) {
  return (
    <div className="Track">
      <img src={track.albumImage} alt={track.name} />
      <div className="Track-info">
        <h3>{track.name} by {track.artist}</h3>
        <p>Album: {track.album}</p>
        <button className="AddTrackButton" onClick={() => onAdd(track)}>Add to Playlist</button>
      </div>
    </div>
  );
}

export default Track;