const express = require('express');
const { Op } = require('sequelize');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { sequelize } = require("../../db/models"); // ✅ Import sequelize

const router = express.Router();

// ✅ Middleware for validating new spot creation
const validateSpot = [
  check("address").notEmpty().withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
  check("country").notEmpty().withMessage("Country is required"),
  check("lat")
    .notEmpty()
    .withMessage("Latitude is required")
    .bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .notEmpty()
    .withMessage("Longitude is required")
    .bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 30 })
    .withMessage("Description must be at least 30 characters long"),
  check("price")
    .notEmpty()
    .withMessage("Price cannot be empty")
    .isFloat({ gt: 0 })
    .withMessage("Price per night must be a positive number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        title: "Bad Request",
        errors: errors.mapped(),
      });
    }
    next();
  },
];

// **Get All Spots with Query Parameters**
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const pagination = {};
    const errors = {};

    if (parseInt(page) < 1 || parseInt(size) < 1 || parseInt(size) > 20) {
      errors.page = "Page must be greater than or equal to 1";
      errors.size = "Size must be between 1 and 20";
    } else {
      pagination.limit = parseInt(size);
      pagination.offset = (parseInt(page) - 1) * parseInt(size);
    }

    const where = {};

    if (minLat && (isNaN(minLat) || minLat < -90 || minLat > 90)) {
      errors.minLat = "minLat must be between -90 and 90";
    } else if (minLat) {
      where.lat = { [Op.gte]: parseFloat(minLat) };
    }

    if (maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) {
      errors.maxLat = "maxLat must be between -90 and 90";
    } else if (maxLat) {
      where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
    }

    if (minLng && (isNaN(minLng) || minLng < -180 || minLng > 180)) {
      errors.minLng = "minLng must be between -180 and 180";
    } else if (minLng) {
      where.lng = { [Op.gte]: parseFloat(minLng) };
    }

    if (maxLng && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) {
      errors.maxLng = "maxLng must be between -180 and 180";
    } else if (maxLng) {
      where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
    }

    if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
      errors.minPrice = "minPrice must be greater than or equal to 0";
    } else if (minPrice) {
      where.price = { [Op.gte]: parseFloat(minPrice) };
    }

    if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
      errors.maxPrice = "maxPrice must be greater than or equal to 0";
    } else if (maxPrice) {
      where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    const spots = await Spot.findAll({
      where,
      include: [
        { model: Review, attributes: ["stars"] },
        { model: SpotImage, attributes: ["url"] },
      ],
      ...pagination,
    });

    const spotList = spots.map((spot) => {
      const spotData = spot.toJSON();
      const avgRating = spotData.Reviews.length
        ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length
        : 0;

      return {
        ...spotData,
        lat: parseFloat(spotData.lat),
        lng: parseFloat(spotData.lng),
        price: parseFloat(spotData.price),
        avgRating: parseFloat(avgRating.toFixed(2)),
        previewImage: spot.SpotImages.length ? spot.SpotImages[0].url : null,
      };
    });

    res.status(200).json({ Spots: spotList, page: parseInt(page), size: parseInt(size) });
  } catch (err) {
    next(err);
  }
});

router.get('/current', requireAuth, async (req, res, next) => {

  // Get the current user

  const userId = req.user.id;

  try {

      // Get the spots belonging to the current user

      const spots = await Spot.findAll({

          where: {
              ownerId: userId
          },

          include: [
              {
                  model: Review,
                  attributes: ['stars']
              },
              {
                  model: SpotImage,
                  attributes: ['url']
              }
          ]
      });

      // Map through each spot, calculate avgRating and fetch previewImage

      const spotList = spots.map(spot => {

          const spotData = spot.toJSON();

          const avgRating = spotData.Reviews && spotData.Reviews.length > 0

              ? spotData.Reviews.reduce((acc, review) => acc + review.stars, 0) / spotData.Reviews.length

              : 0;

          const previewImage = spot.SpotImages[0] ? spot.SpotImages[0].url : null;

          delete spotData.SpotImages;
          delete spotData.Reviews

          // combine each spot with avgRating and previewImage to create spotDetails

          return {
              ...spotData,
              avgRating,
              previewImage
          };
      });

      // return spotDetails as a json response

      res.json({ Spots: spotList })

  } catch (err) {
      next(err);
  };
});

// **Get Spot Details by ID**


router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  try {
    // Fetch the spot with necessary associations
    const spot = await Spot.findByPk(spotId, {
      include: [
        { model: SpotImage, attributes: ["id", "url", "preview"] },
        { model: User, as: "Owner", attributes: ["id", "firstName", "lastName"] },
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Count number of reviews
    const numReviews = await Review.count({ where: { spotId } });

    // Calculate average rating (Ensure it's always a number)
    const avgRatingData = await Review.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
      where: { spotId },
      raw: true,
    });

    let avgStarRating = avgRatingData?.avgRating ? parseFloat(avgRatingData.avgRating) : 0;
    avgStarRating = isNaN(avgStarRating) ? 0 : avgStarRating; // ✅ Ensure avgStarRating is always a number

    const formattedSpot = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: parseFloat(spot.price),
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews,
      avgStarRating: Number(avgStarRating.toFixed(2)), // ✅ Convert to number before `.toFixed()`
      SpotImages: spot.SpotImages,
      Owner: spot.Owner,
    };

    res.json(formattedSpot);
  } catch (error) {
    console.error("🚨 Error fetching spot details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Create a Spot (Now Fetching Created Spot)
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price, images } = req.body;

  try {
    // Create the new spot
    const newSpot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    // Handle images (if provided)
    if (images && images.length > 0) {
      const spotImages = images.map((url, index) => ({
        spotId: newSpot.id,
        url,
        preview: index === 0, // First image is the preview image
      }));
      await SpotImage.bulkCreate(spotImages);
    }

    // ✅ Fetch the newly created spot (includes images)
    const createdSpot = await Spot.findByPk(newSpot.id, {
      include: [{ model: SpotImage, attributes: ["id", "url", "preview"] }],
    });

    if (!createdSpot) {
      return res.status(500).json({ message: "Failed to fetch created spot" });
    }

    res.status(201).json(createdSpot);
  } catch (error) {
    console.error("🚨 Error creating spot:", error);
    res.status(500).json({ message: "Failed to create spot. Please try again." });
  }
});

// ✅ Edit a Spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const spot = await Spot.findOne({ where: { id: spotId } });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  Object.assign(spot, { address, city, state, country, lat, lng, name, description, price });
  await spot.save();

  res.json(spot);
});


// **Delete a Spot**
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await spot.destroy();
    res.json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("🚨 Error deleting spot:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  // Validate URL input
  if (!url) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: { url: 'Image URL is required' },
    });
  }

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const newImage = await SpotImage.create({
      spotId: spot.id,
      url,
      preview,
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });

  } catch (error) {
    console.error('Add Spot Image Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/:spotId/reviews', requireAuth, async (req, res) => {
  try {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user already has a review for the spot
    const existingReview = await Review.findOne({
      where: { spotId, userId },
    });
    if (existingReview) {
      return res.status(500).json({ message: 'User already has a review for this spot' });
    }

    // Validate request body
    if (!review) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      },
      });
    }
    if (typeof stars !== 'number' || stars < 1 || stars > 5) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: { stars: 'Stars must be an integer from 1 to 5' },
      });
    }

    // Create the new review
    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });

    // Send success response
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:spotId/reviews', async (req, res, next) => {

  try {

      const spotId = req.params.spotId;

      // const spot = await Spot.findByPk(spotId);
      const spot = await Spot.findOne({
          where: {
              id: spotId
          }
      })

      if (!spot) {
          res.status(404).json({ message: "Spot couldn't be found" })
      }

      const reviews = await Review.findAll({
          where: {
              spotId: spotId
          },

          include: [
              { model: User, attributes: ['id', 'firstName', 'lastName'] },
              { model: ReviewImage, attributes: ['id', 'url'] }
          ]
      });

      res.status(200).json({Reviews: reviews});

  } catch (err) {
      next(err)
  }
});


/**
 * Helper Function to Find and Delete Images
 * Handles deletion for both SpotImage and ReviewImage models.
 */
const findAndDeleteImage = async (model, imageId, ownerKey, req, res) => {
  try {
    const image = await model.findByPk(imageId, {
      include: { 
        model: ownerKey === 'ownerId' ? Spot : Review, 
        attributes: [ownerKey] 
      },
    });

    if (!image) {
      return res.status(404).json({ message: `${model.name} couldn't be found` });
    }

    const ownerId = image[ownerKey === 'ownerId' ? 'Spot' : 'Review'][ownerKey];
    if (ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await image.destroy();
    return res.json({ message: 'Successfully deleted' });
    
  } catch (error) {
    console.error('Image Deletion Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
/**
 * Delete a Spot Image
 * Requires authentication and spot ownership verification.
 */
router.delete('api/spot-images/:imageId', requireAuth, async (req, res) => {
  await findAndDeleteImage(SpotImage, req.params.imageId, 'ownerId', req, res);
});



// router.post('/:spotId/reviews', requireAuth, async (req, res) => {
//   const { spotId } = req.params;
//   const { review, stars } = req.body;
//   const { user } = req; // user object is attached by requireAuth middleware

//   try {
//     // Check if the spot exists
//     const spot = await Spot.findByPk(spotId);
//     if (!spot) {
//       return res.status(404).json({
//         message: "Spot couldn't be found",
//       });
//     }

//     // Check if a review from the current user already exists for this spot
//     const existingReview = await Review.findOne({
//       where: { spotId, userId: user.id },
//     });
//     if (existingReview) {
//       return res.status(500).json({
//         message: 'User already has a review for this spot',
//       });
//     }

//     // Validate the input
//     if (!review) {
//       return res.status(400).json({
//         message: 'Bad Request',
//         errors: {
//           review: 'Review text is required',
//         },
//       });
//     }
//     if (stars < 1 || stars > 5 || !Number.isInteger(stars)) {
//       return res.status(400).json({
//         message: 'Bad Request',
//         errors: {
//           stars: 'Stars must be an integer from 1 to 5',
//         },
//       });
//     }

//     // Create the new review
//     const newReview = await Review.create({
//       userId: user.id,
//       spotId,
//       review,
//       stars,
//     });

//     // Return successful response
//     return res.status(201).json(newReview);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'An unexpected error occurred',
//     });
//   }
// });


//* GET /api/spots/:spotId/bookings
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;

  try {
    // Find the spot to check if it exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the current user is the owner of the spot
    const isOwner = spot.ownerId === user.id;

    // Fetch bookings based on user ownership
    const bookings = await Booking.findAll({
      where: { spotId },
      attributes: isOwner
        ? undefined // Fetch all attributes if the user is the owner
        : ['spotId', 'startDate', 'endDate'], // Limited attributes if not the owner
      include: isOwner
        ? [
            { model: User, attributes: ['id', 'firstName', 'lastName'] }
          ]
        : [] // No additional models included if not the owner
    });

    // Format and send the response
    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching bookings.' });
  }
});

//* POST /api/spots/:spotId/bookings
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Ensure the spot does not belong to the current user
    if (spot.ownerId === user.id) {
      return res.status(403).json({ message: "You cannot book your own spot" });
    }

    // Validate the dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start < new Date()) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { startDate: "startDate cannot be in the past" }
      });
    }
    if (end <= start) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { endDate: "endDate cannot be on or before startDate" }
      });
    }

    // Check for booking conflicts
    const conflictingBookings = await Booking.findAll({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: { [Op.between]: [startDate, endDate] }
          },
          {
            endDate: { [Op.between]: [startDate, endDate] }
          },
          {
            startDate: { [Op.lte]: startDate },
            endDate: { [Op.gte]: endDate }
          }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      });
    }

    // Create the new booking
    const newBooking = await Booking.create({
      spotId,
      userId: user.id,
      startDate,
      endDate
    });

    // Respond with the new booking details
    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong while creating the booking." });
  }
});

module.exports = router;
