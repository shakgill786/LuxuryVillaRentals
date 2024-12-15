import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Updated to useNavigate
import { fetchAllSpots, deleteSpot } from "../../store/spots";
import SpotTile from "../SpotTile/SpotTile";
import "./ManageSpotsPage.css";

const ManageSpotsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Replaced useHistory with useNavigate
  const user = useSelector((state) => state.session.user);

  // Filter spots to include only the ones owned by the logged-in user
  const spots = useSelector((state) =>
    Object.values(state.spots.allSpots).filter(
      (spot) => spot.ownerId === user?.id
    )
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchAllSpots()); // Fetch user's spots
    }
  }, [dispatch, user]);

  // Navigate to update spot page
  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  // Handle spot deletion
  const handleDelete = async (spotId) => {
    if (window.confirm("Are you sure you want to delete this spot?")) {
      await dispatch(deleteSpot(spotId)); // Remove spot dynamically
      dispatch(fetchAllSpots()); // Re-fetch spots to reflect changes
    }
  };

  // Navigate to create new spot page
  const handleCreateNewSpot = () => {
    navigate("/spots/new");
  };

  return (
    <div className="manage-spots-page">
      <h1>Manage Spots</h1>

      {/* Create New Spot Button */}
      <button onClick={handleCreateNewSpot} className="create-new-spot-button">
        Create a New Spot
      </button>

      {/* Conditionally render spots or fallback message */}
      {(!spots || spots.length === 0) ? (
        <p>You have no spots yet!</p>
      ) : (
        <ul className="spot-tile-list">
          {spots.map((spot) => (
            <SpotTile
              key={spot.id}
              spot={spot}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageSpotsPage;