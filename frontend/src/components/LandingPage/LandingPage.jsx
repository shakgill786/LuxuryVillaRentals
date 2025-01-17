import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { Parallax } from "react-scroll-parallax";
import { fetchAllSpots } from "../../store/spots";
import { Tooltip as ReactTooltip } from "react-tooltip"; // Import ReactTooltip
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LandingPage.css";

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
      {/* Header */}
      <header className="landing-page-header">
        <h1>Choose Your Dream Pad</h1>
      </header>

      {/* Carousel Slider */}
      <section className="spots-slider-container">
        <Slider {...sliderSettings} className="spots-slider">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className="spot-card-slider"
              onClick={() => navigate(`/spots/${spot.id}`)}
            >
              <img
                src={spot.previewImage || "/placeholder.jpg"}
                alt={spot.name}
                className="spot-image-slider"
                data-tooltip-id={`tooltip-slider-${spot.id}`}
                data-tooltip-content={spot.name} // Tooltip for slider spot
              />
              <div className="spot-info">
                <div className="spot-header">
                  <div className="spot-location">{`${spot.city}, ${spot.state}`}</div>
                  <div className="spot-rating">
                    {spot.avgRating ? `⭐ ${spot.avgRating.toFixed(1)}` : "New"}
                  </div>
                </div>
              </div>
              <div className="spot-price">{`$${spot.price} / night`}</div>
              <ReactTooltip
                id={`tooltip-slider-${spot.id}`}
                place="top"
                effect="solid"
              />
            </div>
          ))}
        </Slider>
      </section>

      {/* Parallax Grid */}
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
                onClick={() => navigate(`/spots/${spot.id}`)}
              >
                <img
                  src={spot.previewImage || "/placeholder.jpg"}
                  alt={spot.name}
                  className="spot-image"
                  data-tooltip-id={`tooltip-grid-${spot.id}`}
                  data-tooltip-content={spot.name} // Tooltip for parallax grid
                />
                <div className="spot-info">
                  <div className="spot-header">
                    <div className="spot-location">{`${spot.city}, ${spot.state}`}</div>
                    <div className="spot-rating">
                      {spot.avgRating ? `⭐ ${spot.avgRating.toFixed(1)}` : "New"}
                    </div>
                  </div>
                </div>
                <div className="spot-price">{`$${spot.price} / night`}</div>
                <ReactTooltip
                  id={`tooltip-grid-${spot.id}`}
                  place="top"
                  effect="solid"
                />
              </div>
            </Parallax>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;