import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Parallax } from "react-scroll-parallax"; // Parallax import
import { fetchAllSpots } from "../../store/spots";
import "./LandingPage.css";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchSpots = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        await dispatch(fetchAllSpots());
      } catch (error) {
        console.error("Error fetching spots:", error);
        setFetchError("Failed to load spots. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpots();
  }, [dispatch]);

  return (
    <div className="landing-page">
      <header className="landing-page-header">
        <h1>Choose Your Dream Pad</h1>
      </header>

      <section className="spots-grid-container">
        {isLoading ? (
          <p className="loading-message">Loading spots...</p>
        ) : fetchError ? (
          <p className="error-message">{fetchError}</p>
        ) : (
          <div className="spots-grid">
            {spots.map((spot, idx) => (
              <Parallax
                key={spot.id}
                speed={5 * (idx % 2 === 0 ? 1 : -1)}
                translateY={[-20, 20]}
              >
                <div
                  className="spot-card"
                  title={spot.name}
                  onClick={() => navigate(`/spots/${spot.id}`)}
                >
                  <img
                    src={spot.previewImage || "/placeholder.jpg"}
                    alt={spot.name || "Unnamed Spot"}
                    className="spot-image"
                  />
                  <div className="spot-info">
                    <div className="spot-header">
                      <div className="spot-location">{`${spot.city || "Unknown City"}, ${
                        spot.state || "Unknown State"
                      }`}</div>
                      <div className="spot-rating">
                        {spot.avgRating ? `⭐ ${spot.avgRating.toFixed(1)}` : "New"}
                      </div>
                    </div>
                    <div className="spot-price">{`$${spot.price || 0} / night`}</div>
                  </div>
                </div>
              </Parallax>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;