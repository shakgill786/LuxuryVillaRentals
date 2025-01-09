import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { csrfFetch } from '../../store/csrf'; // Use CSRF fetch
import './ReservationPage.css';

const ReservationPage = () => {
  const location = useLocation();
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
  const [progress, setProgress] = useState(0);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setProgress((prevProgress) => Math.min(prevProgress + 10, 100));
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
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
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