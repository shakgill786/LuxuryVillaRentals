// LuxuryVillaServices/backend/routes/api/reservations.js

const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Reservation } = require('../../db/models'); // Assuming you have a Reservation model
const router = express.Router();

// Validation middleware
const validateReservation = [
  check('name').notEmpty().withMessage('Name is required.'),
  check('email').isEmail().withMessage('Invalid email address.'),
  check('phone').isMobilePhone().withMessage('Invalid phone number.'),
  check('cardName').notEmpty().withMessage('Name on card is required.'),
  check('cardNumber').isCreditCard().withMessage('Invalid credit card number.'),
  check('expirationDate').matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage('Invalid expiration date format.'),
  check('securityCode').isLength({ min: 3, max: 4 }).withMessage('Invalid security code.'),
  handleValidationErrors,
];

// POST /api/reservations
router.post('/', validateReservation, async (req, res) => {
  const { name, email, phone, cardName, cardNumber, expirationDate, securityCode, spotId, checkInDate, checkOutDate } = req.body;

  try {
    // Create a reservation in the database (replace with your ORM or DB logic)
    const reservation = await Reservation.create({
      name,
      email,
      phone,
      cardName,
      cardNumber,
      expirationDate,
      securityCode,
      spotId,
      checkInDate,
      checkOutDate,
    });

    res.status(201).json({ message: 'Reservation confirmed!', reservation });
  } catch (error) {
    console.error('Error processing reservation:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;