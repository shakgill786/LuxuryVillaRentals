import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { Parallax } from 'react-scroll-parallax'; // Parallax import
import { fetchAllSpots } from '../../store/spots';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LandingPage.css';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="landing-page">
      <h1>Choose Your Dream Pad</h1>

      {/* Carousel Slider */}
      <Slider {...sliderSettings} className="spots-slider">
        {spots.map((spot) => (
          <div
            key={spot.id}
            className="spot-card"
            onClick={() => navigate(`/spots/${spot.id}`)}
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
      </Slider>

      {/* Parallax Grid */}
      <div className="spots-grid">
        {spots.map((spot, idx) => (
          <Parallax
            key={idx}
            speed={3 * (idx % 2 === 0 ? 1 : -1)} // Adjusted speed for smoother scrolling
            className="parallax-container"
          >
            <div
              className="spot-card parallax-spot-card"
              onClick={() => navigate(`/spots/${spot.id}`)}
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
          </Parallax>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;