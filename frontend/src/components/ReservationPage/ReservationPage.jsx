import { useState } from 'react';
import './ReservationPage.css';

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Reservation confirmed!');
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
      <h1>Confirm Your Reservation</h1>
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
    </div>
  );
};

export default ReservationPage;