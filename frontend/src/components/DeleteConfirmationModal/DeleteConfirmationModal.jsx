
import "./DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="delete-confirmation-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        <div className="modal-buttons">
          <button className="delete-button" onClick={onConfirm}>
            Yes (Delete Review)
          </button>
          <button className="cancel-button" onClick={onCancel}>
            No (Keep Review)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
