import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllSpots, deleteSpot } from "../../store/spots";
import SpotTile from "../SpotTile/SpotTile";
import "./ManageSpotsPage.css";

const ManageSpotsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  
  const spots = useSelector((state) =>
    Object.values(state.spots.allSpots).filter(
      (spot) => spot.ownerId === user?.id
    )
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchAllSpots());
    }
  }, [dispatch, user]);

  // Navigate to update spot page
  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  // Open delete modal
  const openDeleteModal = (spotId) => {
    setSpotToDelete(spotId);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setSpotToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Handle spot deletion
  const handleDelete = async () => {
    if (spotToDelete) {
      await dispatch(deleteSpot(spotToDelete));
      dispatch(fetchAllSpots()); // Refresh the spots list
      closeDeleteModal();
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
              onDelete={() => openDeleteModal(spot.id)}
            />
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <div className="modal-buttons">
              <button className="delete-button" onClick={handleDelete}>
                Yes (Delete Spot)
              </button>
              <button className="cancel-button" onClick={closeDeleteModal}>
                No (Keep Spot)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSpotsPage;