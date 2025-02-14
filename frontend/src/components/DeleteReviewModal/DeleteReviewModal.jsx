import { useRef, useEffect } from "react";
import "./DeleteReviewModal.css";

const DeleteReviewModal = ({ onDelete, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="close-modal-button" onClick={onClose}>
          ✖
        </button>
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
