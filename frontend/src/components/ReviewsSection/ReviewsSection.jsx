import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews, deleteReview } from "../../store/reviews";
import CreateReviewButton from "../CreateReviewModal/CreateReviewButton";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal"; // Import UpdateReviewModal

const ReviewsSection = ({ spotId, loggedInUser }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => Object.values(state.reviews.spotReviews || {}));
  const spot = useSelector((state) => state.spots.singleSpot);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [reviewToUpdate, setReviewToUpdate] = useState(null);

  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteReview(reviewId));
    await dispatch(fetchReviews(spotId));
    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (reviewId) => {
    setReviewToDelete(reviewId);
    setIsDeleteModalOpen(true);
  };

  const openUpdateModal = (review) => {
    setReviewToUpdate(review);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setReviewToUpdate(null);
    setIsUpdateModalOpen(false);
  };

  const userHasReviewed = reviews.some((review) => review.userId === loggedInUser?.id);
  const isSpotOwner = loggedInUser && spot?.ownerId === loggedInUser.id;
  const shouldShowReviewButton = loggedInUser && !isSpotOwner && !userHasReviewed;

  return (
    <section className="reviews">
      <h3>
        ⭐ {spot?.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}
        {reviews.length > 0 && (
          <>
            <span> · </span>
            <span>{reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</span>
          </>
        )}
      </h3>

      {shouldShowReviewButton && (
        <div className="write-review-button">
          <CreateReviewButton spotId={spotId} />
        </div>
      )}

      {reviews.length > 0 ? (
        <ul className="review-list">
          {reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review) => (
            <li key={review.id}>
              <p>
                <strong>{review.User?.firstName}</strong> · {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
              <p>{review.review}</p>
              {loggedInUser && loggedInUser.id === review.userId && (
                <div className="review-actions">
                  <button className="update-review-button" onClick={() => openUpdateModal(review)}>Update</button>
                  <button className="delete-review-button" onClick={() => openDeleteModal(review.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="first-review-prompt">Be the first to post a review!</p>
      )}

      {isDeleteModalOpen && (
        <DeleteReviewModal
          onDelete={() => handleDeleteReview(reviewToDelete)}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateReviewModal
          review={reviewToUpdate}
          spotId={spotId}
          closeModal={closeUpdateModal}
        />
      )}
    </section>
  );
};

export default ReviewsSection;