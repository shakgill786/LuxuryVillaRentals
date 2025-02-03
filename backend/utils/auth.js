// LuxuryVillaServices/backend/utils/auth.js

const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  const token = jwt.sign({ data: safeUser }, secret, {
    expiresIn: "24h", // Fix expiration to 24 hours
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true, // Prevent frontend access
    secure: isProduction, 
    sameSite: isProduction ? "Lax" : "Strict", 
  });

  console.log("✅ Token Set for User:", safeUser);

  return token;
};

const restoreUser = (req, res, next) => {
  const { token } = req.cookies;
  req.user = null;

  if (!token) {
    console.error("❌ No session token found.");
    return next();
  }

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      console.error("❌ Invalid token:", err.message);
      res.clearCookie("token"); // Clear token if invalid
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: { include: ["email", "createdAt", "updatedAt"] },
      });

      if (!req.user) {
        console.error("❌ User not found in database.");
        res.clearCookie("token");
      }

      console.log("👤 User Restored:", req.user ? req.user.toJSON() : "No user found");
    } catch (e) {
      console.error("❌ Error fetching user:", e.message);
      res.clearCookie("token");
      return next();
    }

    return next();
  });
};

// Ensure user is authenticated
const requireAuth = (req, _res, next) => {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = { message: "Authentication required" };
  err.status = 401;
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };