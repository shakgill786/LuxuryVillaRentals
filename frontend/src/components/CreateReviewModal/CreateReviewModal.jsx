import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { postReview, fetchReviews } from "../../store/spots";
import "./CreateReviewModal.css";

function CreateReviewModal({ spotId, closeModal }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});

  // Ref to the modal content
  const modalRef = useRef(null);

  useEffect(() => {
    // Close modal if clicked outside
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
      await dispatch(postReview(spotId, reviewData));
      setReview("");
      setStars(5);
      closeModal();
      await dispatch(fetchReviews(spotId));
    } catch (error) {
      setErrors({ api: "Review already exists for this spot" });
    }
  };

  return (
    <div className="create-review-modal">
      <div className="modal-content" ref={modalRef}>
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