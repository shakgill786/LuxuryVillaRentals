import { useState } from "react";
import { useDispatch } from "react-redux";
import { postReview } from "../../store/spots";
import "./CreateReviewModal.css";

function CreateReviewModal({ spotId, closeModal }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (review.length < 10) {
      setErrors({ review: "Review must be at least 10 characters." });
      return;
    }

    const reviewData = { review, stars };

    try {
      await dispatch(postReview(spotId, reviewData));
      closeModal();
    } catch (error) {
      setErrors({ api: "Failed to submit review. Please try again." });
    }
  };

  return (
    <div className="create-review-modal">
      <div className="modal-content">
        <button className="close-modal" onClick={closeModal}>
          ✕
        </button>
        <h2>How was your stay?</h2>
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
                className={stars > index ? "star filled" : "star"}
                onClick={() => setStars(index + 1)}
              >
                ★
              </button>
            ))}
            <span>Stars</span>
          </div>
          <button
            type="submit"
            disabled={review.length < 10 || stars === 0}
          >
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateReviewModal;