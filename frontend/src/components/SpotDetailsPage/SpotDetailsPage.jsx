import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpotDetails } from "../../store/spots"; // Thunk action to fetch spot details
import "./SpotDetailsPage.css";

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.singleSpot); // Assuming we have a `singleSpot` key in the spots reducer
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchSpotDetails(spotId)); // Fetch spot details using the thunk
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
          <img src={spot.SpotImages[0]?.url || "/placeholder.jpg"} alt={spot.name} />
        </div>
        <div className="thumbnail-images">
          {spot.SpotImages.slice(1, 5).map((image, idx) => (
            <img key={idx} src={image.url} alt={`Thumbnail ${idx + 1}`} />
          ))}
        </div>
      </section>

      {/* Host and Description */}
      <section className="host-info">
        <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
        <p>{spot.description}</p>
      </section>

      {/* Pricing and Reserve Section */}
      <section className="pricing-reserve">
        <div className="pricing">
          <p>${spot.price} / night</p>
          <p>
            <span>⭐ {spot.avgStarRating || "New"}</span> ·{" "}
            <span>{spot.numReviews || 0} {spot.numReviews === 1 ? "review" : "reviews"}</span>
          </p>
        </div>
        <button
          className="reserve-button"
          onClick={() => alert("Feature Coming Soon")}
        >
          Reserve
        </button>
      </section>

      {/* Reviews Section */}
      <section className="reviews">
        <h3>⭐ {spot.avgStarRating || "New"} · {spot.numReviews || 0} {spot.numReviews === 1 ? "review" : "reviews"}</h3>
        {spot.Reviews?.length > 0 ? (
          <ul className="review-list">
            {spot.Reviews.map((review) => (
              <li key={review.id}>
                <p>
                  <strong>{review.User?.firstName}</strong> ·{" "}
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>{review.review}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet. Be the first to leave a review!</p>
        )}
      </section>
    </div>
  );
};

export default SpotDetailsPage;