const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
  const { name, email, phone, cardName, cardNumber, expirationDate, securityCode } = req.body;

  try {
    // Simulate storing reservation or processing payment
    console.log('Reservation received:', {
      name,
      email,
      phone,
      cardName,
      cardNumber,
      expirationDate,
      securityCode,
    });

    res.status(201).json({ message: 'Reservation confirmed!' });
  } catch (error) {
    console.error('Error processing reservation:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;