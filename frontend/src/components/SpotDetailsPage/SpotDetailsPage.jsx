import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { fetchSpotDetails } from '../../store/spots';
import ReviewsSection from '../ReviewsSection/ReviewsSection';
import './SpotDetailsPage.css';

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.singleSpot);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSpotDetails(spotId));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching spot details:', error);
      }
    };
    fetchData();
  }, [dispatch, spotId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading) return <div>Loading...</div>;
  if (!spot) return <div>Spot not found!</div>;

  return (
    <div className="spot-details-page">
      <header className="spot-header">
        <h1 onClick={openModal}>{spot.name}</h1>
        <p>
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </header>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="spot-modal">
        <div className="modal-content">
          <h1>{spot.name}</h1>
          <p>{spot.description}</p>
          <button onClick={closeModal} className="close-modal">
            Close
          </button>
        </div>
      </Modal>

      <section className="image-gallery">
        <div className="main-image">
          <img src={spot.SpotImages[0]?.url || '/placeholder.jpg'} alt={spot.name} />
        </div>
        <div className="thumbnail-images">
          {spot.SpotImages.slice(1, 5).map((image, idx) => (
            <img key={idx} src={image.url} alt={`Thumbnail ${idx + 1}`} />
          ))}
        </div>
      </section>

      <div className="Details-body">
        <section className="host-info">
          <h2>
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </h2>
          <p>{spot.description}</p>
        </section>

        <section className="pricing-reserve">
          <div className="pricing">
            <p>${spot.price} / night</p>
            <p>
              <span>
                ⭐ {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : 'New'}
              </span>
              {spot.numReviews > 0 && (
                <>
                  {' '}·{' '}
                  <span>
                    {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            className="reserve-button"
            onClick={() => alert('Feature Coming Soon')}
          >
            Reserve
          </button>
        </section>
      </div>

      <hr className="section-divider" />

      <ReviewsSection spotId={spotId} loggedInUser={loggedInUser} />
    </div>
  );
};

export default SpotDetailsPage;