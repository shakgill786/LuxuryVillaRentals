const express = require('express');
const { Op } = require('sequelize'); // Make sure Op is imported
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// **Validation middleware for creating/updating bookings**
const validateBooking = [
  check('startDate').isISO8601().withMessage('Start date is required'),
  check('endDate').isISO8601().withMessage('End date is required'),
  handleValidationErrors,
];

//* GET /api/bookings/current
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;

  try {
    const bookings = await Booking.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Spot,
          attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'price',
          ],
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
              where: { preview: true },
              required: false,
            },
          ],
        },
      ],
    });

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching bookings.' });
  }
});

//* POST /api/bookings
router.post('/', requireAuth, validateBooking, async (req, res) => {
  const { user } = req;
  const { spotId, startDate, endDate } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

    if (spot.ownerId === user.id) {
      return res.status(403).json({ message: "You cannot book your own spot." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start < new Date()) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { startDate: "startDate cannot be in the past" },
      });
    }
    if (end <= start) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { endDate: "endDate cannot be on or before startDate" },
      });
    }

    const conflictingBookings = await Booking.findAll({
      where: {
        spotId,
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
          { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    const newBooking = await Booking.create({
      userId: user.id,
      spotId,
      startDate,
      endDate,
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

//* PUT /api/bookings/:bookingId
router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const { user } = req;
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;

  try {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });

    if (booking.userId !== user.id) {
      return res.status(403).json({ message: "You are not authorized to modify this booking" });
    }

    if (new Date(booking.endDate) < new Date()) {
      return res.status(403).json({ message: "Past bookings can't be modified" });
    }

    const conflictingBookings = await Booking.findAll({
      where: {
        spotId: booking.spotId,
        id: { [Op.ne]: booking.id },
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
          { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while updating the booking.' });
  }
});

//* DELETE /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { user } = req;
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findByPk(bookingId, {
      include: { model: Spot, attributes: ['ownerId'] },
    });

    if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });

    const isAuthorized = booking.userId === user.id || booking.Spot.ownerId === user.id;
    if (!isAuthorized) {
      return res.status(403).json({ message: "You are not authorized to delete this booking" });
    }

    if (new Date(booking.startDate) <= new Date()) {
      return res.status(403).json({
        message: "Bookings that have been started can't be deleted",
      });
    }

    await booking.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while deleting the booking.' });
  }
});

module.exports = router;