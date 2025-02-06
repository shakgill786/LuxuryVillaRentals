import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { fetchAllSpots, deleteSpot } from "../../store/spots";
import SpotTile from "../SpotTile/SpotTile";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal"; // Import modal
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchAllSpots());
    }
  }, [dispatch, user]);

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const openDeleteModal = (spotId) => {
    setSpotToDelete(spotId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSpotToDelete(null);
  };

  const confirmDeleteSpot = async () => {
    if (spotToDelete) {
      await dispatch(deleteSpot(spotToDelete));
      dispatch(fetchAllSpots());
      closeDeleteModal();
    }
  };

  const handleCreateNewSpot = () => {
    navigate("/spots/new");
  };

  return (
    <div className="manage-spots-page">
      <h1>Manage Spots</h1>

      <button onClick={handleCreateNewSpot} className="create-new-spot-button">
        Create a New Spot
      </button>

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
      <DeleteSpotModal 
        isOpen={isModalOpen} 
        onClose={closeDeleteModal} 
        onDelete={confirmDeleteSpot} 
      />
    </div>
  );
};

export default ManageSpotsPage;