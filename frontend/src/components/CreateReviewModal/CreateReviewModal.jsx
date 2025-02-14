import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addReviewThunk } from "../../store/reviews"; // ✅ Replace postReview with addReviewThunk
import "./CreateReviewModal.css";

function CreateReviewModal({ spotId, spotName, closeModal }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [errors, setErrors] = useState({});
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (review.length < 10) {
      setErrors({ review: "Review must be at least 10 characters." });
      return;
    }

    const reviewData = { review, stars };
    try {
      await dispatch(addReviewThunk(spotId, reviewData)); // ✅ Use addReviewThunk here
      setReview("");
      setStars(0);
      closeModal();
    } catch (error) {
      setErrors({ api: "Failed to submit the review. Please try again." });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="close-modal-button" onClick={closeModal}>
          ✖
        </button>
        <h2>How was your stay at <span className="spot-name">&quot;{spotName}&quot;</span>?</h2>
        {errors.api && <p className="error">{errors.api}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Leave your review here..."
            required
          ></textarea>
          {errors.review && <p className="error">{errors.review}</p>}
          <div className="star-rating">
            {[...Array(5)].map((_, index) => (
              <button
                type="button"
                key={index}
                className={`star ${index + 1 <= (hoveredStars || stars) ? "filled" : ""}`}
                onClick={() => setStars(index + 1)}
                onMouseEnter={() => setHoveredStars(index + 1)}
                onMouseLeave={() => setHoveredStars(0)}
              >
                ★
              </button>
            ))}
            <span>{stars > 0 ? `${stars} Stars` : "Stars"}</span>
          </div>
          <button type="submit" disabled={review.length < 10 || stars === 0}>
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateReviewModal;
