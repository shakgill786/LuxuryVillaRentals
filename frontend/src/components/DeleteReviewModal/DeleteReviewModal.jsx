import "./DeleteReviewModal.css";

const DeleteReviewModal = ({ onDelete, onClose }) => {
  return (
    <div className="delete-review-modal">
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        <div className="modal-buttons">
          <button className="delete-button" onClick={onDelete}>
            Yes (Delete Review)
          </button>
          <button className="cancel-button" onClick={onClose}>
            No (Keep Review)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewModal;