import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Parallax } from "react-scroll-parallax"; // Parallax import
import { fetchAllSpots } from "../../store/spots";
import "./LandingPage.css";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  // Debugging: Log the fetched spots to verify their data
  console.log("Fetched Spots:", spots);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  return (
    <div className="landing-page">
      <header className="landing-page-header">
        <h1>Choose Your Dream Pad</h1>
      </header>

      {/* Parallax Grid (Main Section) */}
      <section className="spots-grid-container">
        <div className="spots-grid">
          {spots.map((spot, idx) => (
            <Parallax
              key={idx}
              speed={5 * (idx % 2 === 0 ? 1 : -1)}
              translateY={[-20, 20]}
            >
              <div
                className="spot-card"
                title={spot.name} // Tooltip with spot name
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
                </div>
                <div className="spot-price">{`$${spot.price || 0} / night`}</div>
              </div>
            </Parallax>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;