import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews, deleteReview } from "../../store/reviews";
import CreateReviewButton from "../CreateReviewModal/CreateReviewButton";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

const ReviewsSection = ({ spotId, loggedInUser }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => Object.values(state.reviews.spotReviews || {}));

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Fetch reviews on mount
  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        await dispatch(fetchReviews(spotId));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviewsData();
  }, [dispatch, spotId, reviews]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(deleteReview(reviewId)); // Dispatch delete action
      await dispatch(fetchReviews(spotId)); // Re-fetch reviews
      closeDeleteModal(); // Close the modal
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const openDeleteModal = (reviewId) => {
    setReviewToDelete(reviewId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setReviewToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Safely get average rating or default to "New"
  const avgStarRating = reviews.length > 0 && reviews[0].spot?.avgStarRating
    ? reviews[0].spot.avgStarRating.toFixed(1)
    : "New";

  return (
    <section className="reviews">
      <h3>
        ⭐ {avgStarRating}
        {reviews.length > 0 && (
          <>
            <span> · </span>
            <span>
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </>
        )}
      </h3>

      {/* Create Review Button */}
      {loggedInUser && (
        <div className="write-review-button">
          <CreateReviewButton spotId={spotId} />
        </div>
      )}

      {/* Render Reviews */}
      {reviews.length > 0 ? (
        <ul className="review-list">
          {reviews
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((review) => (
              <li key={review.id}>
                <p>
                  <strong>{review.User?.firstName}</strong> ·{" "}
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>{review.review}</p>
                {loggedInUser && loggedInUser.id === review.userId && (
                  <button
                    className="delete-review-button"
                    onClick={() => openDeleteModal(review.id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      {/* Delete Review Modal */}
      {isDeleteModalOpen && (
        <DeleteReviewModal
          onDelete={() => handleDeleteReview(reviewToDelete)}
          onClose={closeDeleteModal}
        />
      )}
    </section>
  );
};

export default ReviewsSection;