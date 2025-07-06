import './Track.css';

function Track({ track, onAdd, onRemove }) {
  return (
    <div className="Track">
      <img src={track.albumImage} alt={track.name} />
      <div className="Track-info">
        <h3>{track.name} by {track.artist}</h3>
        <p>Album: {track.album}</p>
        {onAdd && <button onClick={() => onAdd(track)}>Add to Playlist</button>}
        {onRemove && <button onClick={() => onRemove(track)}>Remove</button>}
      </div>
    </div>
  );
}

export default Track;
