import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { fetchSpotDetails } from '../../store/spots';
import ReviewsSection from '../ReviewsSection/ReviewsSection';
import Calendar from 'react-calendar'; // Assuming react-calendar is installed
import { csrfFetch } from '../../store/csrf'; // Updated to use CSRF fetch
import 'react-calendar/dist/Calendar.css'; // Default calendar styles
import './SpotDetailsPage.css';

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.singleSpot);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

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

  const handleReserve = async () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates.');
      return;
    }

    try {
      const response = await csrfFetch(`/api/bookings`, {
        method: 'POST',
        body: JSON.stringify({
          spotId,
          startDate: checkInDate.toISOString().split('T')[0],
          endDate: checkOutDate.toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        alert('Reservation successful!');
        setCheckInDate(null);
        setCheckOutDate(null);
      } else {
        const errorData = await response.json();
        alert(`Reservation failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!spot) return <div>Spot not found!</div>;

  return (
    <div className="spot-details-page">
      <header className="spot-header">
        <h1 onClick={() => setIsModalOpen(true)}>{spot.name}</h1>
        <p>
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </header>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="spot-modal">
        <div className="modal-content">
          <h1>{spot.name}</h1>
          <p>{spot.description}</p>
          <button onClick={() => setIsModalOpen(false)} className="close-modal">
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
          <Calendar
            selectRange={true}
            onChange={(dates) => {
              setCheckInDate(dates[0]);
              setCheckOutDate(dates[1]);
            }}
          />
          <button className="reserve-button" onClick={handleReserve}>
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