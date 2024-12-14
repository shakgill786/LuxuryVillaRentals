import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpotDetails } from "../../store/spots"; // Thunk actions
import { deleteReview, fetchReviews } from "../../store/reviews";
import "./SpotDetailsPage.css";
import CreateReviewButton from "../CreateReviewModal/CreateReviewButton";

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => Object.values(state.reviews.spotReviews || {}));
  console.log("Reviews: ", reviews); 
  
  // Action Types
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchSpotDetails(spotId));
      await dispatch(fetchReviews(spotId)); // Fetch reviews for the spot
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, spotId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found!</div>;
  }

  return (
    <div className="spot-details-page">
      {/* Header Section */}
      <header className="spot-header">
        <h1>{spot.name}</h1>
        <p>
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </header>

      {/* Image Gallery */}
      <section className="image-gallery">
        <div className="main-image">
          <img
            src={spot.SpotImages[0]?.url || "/placeholder.jpg"}
            alt={spot.name}
          />
        </div>
        <div className="thumbnail-images">
          {spot.SpotImages.slice(1, 5).map((image, idx) => (
            <img key={idx} src={image.url} alt={`Thumbnail ${idx + 1}`} />
          ))}
        </div>
      </section>

      {/* Details Body */}
      <div className="Details-body">
        {/* Host and Description */}
        <section className="host-info">
          <h2>
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </h2>
          <p>{spot.description}</p>
        </section>

        {/* Pricing and Reserve Section */}
        <section className="pricing-reserve">
          <div className="pricing">
            <p>${spot.price} / night</p>
            <p>
              <span>
                ⭐ {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}
              </span>
              {spot.numReviews > 0 && (
                <>
                  {" "}·{" "}
                  <span>
                    {spot.numReviews} {spot.numReviews === 1 ? "review" : "reviews"}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            className="reserve-button"
            onClick={() => alert("Feature Coming Soon")}
          >
            Reserve
          </button>
        </section>
      </div>

      <hr className="section-divider" />

      {/* Reviews Section */}
      <section className="reviews">
        <h3>
          ⭐ {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}
          {spot.numReviews > 0 && (
            <>
              <span> · </span>
              <span>
                {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}
              </span>
            </>
          )}
        </h3>

          {/* Create Review Button */}
          {loggedInUser && loggedInUser.id !== spot.ownerId && (
          <div className="write-review-button">
            <CreateReviewButton spotId={spotId} />
          </div>
        )}


         {/* Render reviews */}
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
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this review?")) {
                          await dispatch(deleteReview(review.id));
                          dispatch(fetchReviews(spotId));
                        }
                      }}
                      
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

      </section>
    </div>
  );
};

export default SpotDetailsPage;