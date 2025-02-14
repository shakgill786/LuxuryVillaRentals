import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { fetchSpotDetails } from "../../store/spots";
import { fetchReviews } from "../../store/reviews";  // Fetch reviews
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal"; 
import "./SpotDetailsPage.css";

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => Object.values(state.reviews.spotReviews || {}));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSpotDetails(spotId));
        await dispatch(fetchReviews(spotId));
        setIsLoading(false);
      } catch (err) {
        console.error("❌ Error fetching spot details:", err);
        setError("Failed to load spot details. Please try again.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, spotId]);

  const handleReserve = () => {
    alert("Feature coming soon!");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!spot || Object.keys(spot).length === 0) return <div>Spot not found!</div>;

  const avgRating = spot.avgStarRating && !isNaN(spot.avgStarRating)
    ? Number(spot.avgStarRating).toFixed(1)
    : "New";

  // Check if the logged-in user is the spot owner or has already reviewed
  const isSpotOwner = loggedInUser && spot.ownerId === loggedInUser.id;
  const userHasReviewed = reviews.some((review) => review.userId === loggedInUser?.id);
  const shouldShowReviewButton = loggedInUser && !isSpotOwner && !userHasReviewed;

  return (
    <div className="spot-details-page">
      <header className="spot-header">
        <h1>{spot.name}</h1>
        <p>{spot.city}, {spot.state}, {spot.country}</p>
      </header>

      {/* Modal for Spot Details */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="spot-modal">
        <div className="modal-content">
          <h1>{spot.name}</h1>
          <p>{spot.description}</p>
          <button onClick={() => setIsModalOpen(false)} className="close-modal">Close</button>
        </div>
      </Modal>

      {/* Image Gallery */}
      <section className="image-gallery">
        <div className="main-image">
          <img src={spot.SpotImages?.[0]?.url || "/placeholder.jpg"} alt={spot.name} />
        </div>
        <div className="thumbnail-images">
          {spot.SpotImages?.slice(1, 5).map((image, idx) => (
            <img key={idx} src={image.url} alt={`Thumbnail ${idx + 1}`} />
          ))}
        </div>
      </section>

      <div className="Details-body">
        <section className="host-info">
          <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
          <p>{spot.description}</p>
        </section>

        <section className="pricing-reserve">
          <div className="pricing">
            <p>${spot.price} / night</p>
            <p>
              <span>⭐ {avgRating}</span>
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
          <button className="reserve-button" onClick={handleReserve}>
            Reserve
          </button>
        </section>
      </div>

      <hr className="section-divider" />

      <section className="reviews-section">
        <h2>Reviews</h2>
        {shouldShowReviewButton && (
          <button className="write-review-button" onClick={() => setIsReviewModalOpen(true)}>
            Write a Review
          </button>
        )}

        <ReviewsSection spotId={spotId} loggedInUser={loggedInUser} />

        {/* Create Review Modal */}
        {isReviewModalOpen && (
          <CreateReviewModal
            spotId={spotId}
            spotName={spot.name}
            closeModal={() => setIsReviewModalOpen(false)}
          />
        )}
      </section>
    </div>
  );
};

export default SpotDetailsPage;
