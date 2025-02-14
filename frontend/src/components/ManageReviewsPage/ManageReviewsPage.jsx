import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews, deleteReview } from "../../store/reviews";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal";
import "./ManageReviewsPage.css";

const ManageReviewsPage = () => {
  const dispatch = useDispatch();
  const userReviews = useSelector((state) => Object.values(state.reviews.userReviews || {}));
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  useEffect(() => {
    dispatch(fetchUserReviews());
  }, [dispatch]);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await dispatch(deleteReview(reviewId));
    }
  };

  const openUpdateModal = (review) => {
    setCurrentReview(review);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setCurrentReview(null);
  };

  return (
    <div className="manage-reviews-page">
      <h1>Manage Your Reviews</h1>
      {userReviews.length === 0 ? (
        <p>You haven&apos;t written any reviews yet.</p>
      ) : (
        <ul className="review-list">
          {userReviews.map((review) => (
            <li key={review.id} className="review-item">
              <div className="review-details">
                <p>
                  <strong>{review.Spot.name}</strong> · {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>{review.review}</p>
              </div>
              <div className="review-actions">
                <button className="update-button" onClick={() => openUpdateModal(review)}>
                  Update
                </button>
                <button className="delete-button" onClick={() => handleDeleteReview(review.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showUpdateModal && (
        <UpdateReviewModal
          review={currentReview}
          closeModal={closeUpdateModal}
        />
      )}
    </div>
  );
};

export default ManageReviewsPage;
