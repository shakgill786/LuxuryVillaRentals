import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpots } from '../../store/spots';
import './LandingPage.css';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve spots data from Redux store
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    // Fetch all spots on component mount
    dispatch(fetchAllSpots());
  }, [dispatch]);

  return (
    <div className="landing-page">
      <h1>Explore Luxury Villas</h1>
      <div className="spots-grid">
        {spots.map((spot) => (
          <div
            key={spot.id}
            className="spot-card"
            onClick={() => navigate(`/spots/${spot.id}`)} // Navigate to spot details page
            title={spot.name} // Adds a tooltip with the spot's name
          >
            <img
              src={spot.previewImage || '/placeholder.jpg'}
              alt={spot.name}
              className="spot-image"
            />
            <div className="spot-info">
            <div className="spot-header">
              <div className="spot-location">{`${spot.city}, ${spot.state}`}</div>
              <div className="spot-rating">
                {spot.avgRating ? `⭐ ${spot.avgRating.toFixed(1)}` : 'New'}
              </div>
            </div>
            </div>
            <div className="spot-price">{`$${spot.price} / night`}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;