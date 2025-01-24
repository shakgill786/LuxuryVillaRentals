import { useNavigate } from "react-router-dom";
import "./SpotTile.css";

const SpotTile = ({ spot, onUpdate, onDelete }) => {
  const navigate = useNavigate();

  const handleSpotClick = () => {
    navigate(`/spots/${spot.id}`); // Navigate to spot details page
  };

  // Debugging: Log spot details
  console.log("Spot Name:", spot.name);
  console.log("Spot ID:", spot.id);

  return (
    <div className="spot-tile">
      <div className="tooltip-wrapper" onClick={handleSpotClick}>
        <img
          src={spot.previewImage || "/placeholder.jpg"}
          alt={spot.name}
          className="spot-image"
        />
        {/* Tooltip element */}
        <div className="tooltip">{spot.name || "No name available"}</div>
      </div>
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
        <button
          className="update-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent click bubbling to parent
            onUpdate(spot.id);
          }}
        >
          Update
        </button>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent click bubbling to parent
            onDelete(spot.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SpotTile;