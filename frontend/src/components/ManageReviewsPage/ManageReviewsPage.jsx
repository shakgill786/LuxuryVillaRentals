import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews } from "../../store/reviews";
import "./ManageReviewsPage.css";

const ManageReviewsPage = ({ user }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) =>
    Object.values(state.reviews.spotReviews || {}).filter(
      (review) => review.userId === user.id
    )
  );

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        await dispatch(fetchReviews());
      } catch (error) {
        console.error("Failed to fetch user reviews:", error);
      }
    };

    fetchUserReviews();
  }, [dispatch]);

  return (
    <div className="manage-reviews-page">
      <h1>Manage Your Reviews</h1>
      <p>Here&rsquo;s your review history:</p> {/* Corrected unescaped apostrophe */}
      {reviews.length > 0 ? (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <div className="review-header">
                <strong>{review.Spot?.name}</strong> ·{" "}
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <p>{review.review}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven&rsquo;t posted any reviews yet.</p> /* Corrected unescaped apostrophe */
      )}
    </div>
  );
};

export default ManageReviewsPage;
