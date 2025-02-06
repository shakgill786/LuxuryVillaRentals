import "./DeleteSpotModal.css";

const DeleteSpotModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot?</p>
        <div className="delete-modal-buttons">
          <button className="delete-button" onClick={onDelete}>
            Yes (Delete Spot)
          </button>
          <button className="cancel-button" onClick={onClose}>
            No (Keep Spot)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSpotModal;