import { useNavigate } from "react-router-dom";
import "./SpotTile.css";

const SpotTile = ({ spot, onUpdate, onDelete }) => {
  const navigate = useNavigate();

  const handleSpotClick = () => {
    navigate(`/spots/${spot.id}`); // Navigate to spot details page
  };

  return (
    <div className="spot-tile" title={spot.name}>
      <img
        src={spot.previewImage || "/placeholder.jpg"}
        alt={spot.name}
        onClick={handleSpotClick}
        className="spot-image"
      />
      <div className="spot-info">
        <div className="spot-header">
          <span className="spot-location">
            {spot.city}, {spot.state}
          </span>
          <span className="spot-rating">
            ⭐ {spot.avgStarRating || "New"}
          </span>
        </div>
        <p className="spot-price">
          <strong>${spot.price}</strong> / night
        </p>
      </div>
      <div className="spot-actions">
        <button className="update-button" onClick={() => onUpdate(spot.id)}>
          Update
        </button>
        <button className="delete-button" onClick={() => onDelete(spot.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default SpotTile;