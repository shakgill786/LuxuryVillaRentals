import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { csrfFetch } from '../../store/csrf'; // Use CSRF fetch
import './ReservationPage.css';

// Map card types to their respective logos
const cardLogos = {
  visa: '/visa.png',
  mastercard: '/mastercard.png',
  amex: '/amex.png',
  discover: '/discover.png',
  default: '/default.png',
};

// Function to detect card type based on the card number
const getCardType = (number) => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
  };

  for (const [cardType, pattern] of Object.entries(patterns)) {
    if (pattern.test(number)) return cardType;
  }

  return 'default'; // Fallback to default if no pattern matches
};

const ReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { spotId, checkInDate, checkOutDate, spotName, spotPrice } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
  });
  const [cardType, setCardType] = useState('default');
  const [progress, setProgress] = useState(0);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setProgress((prevProgress) => Math.min(prevProgress + 10, 100));

    if (name === 'cardNumber') {
      setCardType(getCardType(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await csrfFetch('/api/reservations', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          spotId,
          checkInDate,
          checkOutDate,
        }),
      });

      if (response.ok) {
        setReservationSuccess(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="reservation-page">
      {reservationSuccess ? (
        <div className="success-message">
          <h1>🎉 Reservation Confirmed!</h1>
          <p>
            Thank you for booking {spotName}! Your stay from {checkInDate} to {checkOutDate} is confirmed.
          </p>
        </div>
      ) : (
        <>
          <button
            className="close-button"
            onClick={() => navigate(`/spots/${spotId}`)}
          >
            ✖
          </button>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <h1>Confirm Your Reservation</h1>
          <p>
            Booking for <strong>{spotName}</strong> at <strong>${spotPrice}/night</strong>
          </p>
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Name on Card</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Credit Card Number</label>
              <div className="card-number-container">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                />
                <img
                  src={cardLogos[cardType]}
                  alt={`${cardType} logo`}
                  className="card-logo"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Expiration Date (MM/YY)</label>
              <input
                type="text"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Security Code (CVV)</label>
              <input
                type="text"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Confirm Reservation
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ReservationPage;