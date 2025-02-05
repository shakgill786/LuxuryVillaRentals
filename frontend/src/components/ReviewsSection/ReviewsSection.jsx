import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews, deleteReview } from "../../store/reviews";
import CreateReviewButton from "../CreateReviewModal/CreateReviewButton";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

const ReviewsSection = ({ spotId, loggedInUser }) => {
  const dispatch = useDispatch();
  
  // Fetch reviews & spot details from Redux
  const reviews = useSelector((state) => Object.values(state.reviews.spotReviews || {}));
  const spot = useSelector((state) => state.spots.singleSpot);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteReview(reviewId));
    await dispatch(fetchReviews(spotId));
    closeDeleteModal();
  };

  const openDeleteModal = (reviewId) => {
    setReviewToDelete(reviewId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setReviewToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // ✅ Check if the logged-in user is the owner of the spot
  const isSpotOwner = loggedInUser?.id === spot?.ownerId;

  // ✅ Check if the logged-in user has already posted a review
  const hasUserReviewed = reviews.some((review) => review.userId === loggedInUser?.id);

  // ✅ Hide "Post Your Review" button if user is owner or has already reviewed
  const shouldShowReviewButton = loggedInUser && !isSpotOwner && !hasUserReviewed;

  // Get the average star rating or default to "New"
  const avgStarRating =
    reviews.length > 0 && spot?.avgStarRating
      ? spot.avgStarRating.toFixed(1)
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

      {/* ✅ Only show "Post Your Review" button if conditions allow */}
      {shouldShowReviewButton && (
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

                {/* ✅ Show delete button only if user is the owner of the review */}
                {loggedInUser?.id === review.userId && (
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