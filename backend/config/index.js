// LuxuryVillaServices/backend/config/index.js

require("dotenv").config();

module.exports = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,
  dbFile: process.env.DB_FILE || "./backend/db/dev.sqlite",
  jwtConfig: {
    secret: process.env.JWT_SECRET || "supersecret",
    expiresIn: "24h", // Ensure expiration is long enough
  },
};