const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  // Parse `expiresIn` to ensure it's a number
  const token = jwt.sign({ data: safeUser }, secret, {
    expiresIn: parseInt(expiresIn, 10), // Ensure it's a valid number
  });

  const isProduction = process.env.NODE_ENV === "production";

  // Check and convert `expiresIn` to milliseconds safely
  const maxAge = parseInt(expiresIn, 10) * 1000; // Convert to ms
  if (isNaN(maxAge) || maxAge <= 0) {
    throw new Error("Invalid 'expiresIn' value in jwtConfig.");
  }

  // Set the token cookie
  res.cookie("token", token, {
    maxAge, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};


const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ['email', 'createdAt', 'updatedAt']
        }
      });
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };