// LuxuryVillaServices/frontend/src/components/UpdateReviewModal/UpdateReviewModal.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateReviewThunk, fetchReviews } from "../../store/reviews";
import "./UpdateReviewModal.css";

const UpdateReviewModal = ({ review, spotId, closeModal }) => {
  const dispatch = useDispatch();
  const [updatedReview, setUpdatedReview] = useState(review.review);
  const [stars, setStars] = useState(review.stars);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (updatedReview.length < 10) {
      setErrors({ review: "Review must be at least 10 characters." });
      return;
    }

    try {
      await dispatch(updateReviewThunk(review.id, { review: updatedReview, stars }));
      await dispatch(fetchReviews(spotId));
      closeModal();
    } catch (error) {
      setErrors({ api: "Failed to update the review. Please try again." });
    }
  };

  return (
    <div className="update-review-modal">
      <div className="modal-content">
        <h2>Update Your Review</h2>
        {errors.api && <p className="error">{errors.api}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            value={updatedReview}
            onChange={(e) => setUpdatedReview(e.target.value)}
            placeholder="Update your review here..."
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
          <button type="submit" disabled={updatedReview.length < 10 || stars === 0}>
            Update Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateReviewModal;