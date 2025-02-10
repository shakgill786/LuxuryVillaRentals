const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { restoreUser } = require("./utils/auth");
const { ValidationError } = require("sequelize");
const { environment } = require("./config");

const isProduction = environment === "production";
const routes = require("./routes");

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// ✅ CORS (Allow Frontend to Access Backend)
app.use(
  cors({
    origin: isProduction
      ? "https://luxuryvillarentals.onrender.com" // Deployed frontend
      : "http://localhost:5173", // Local development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Security Middleware
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// ✅ Restore User Middleware (Ensures Authentication Works) – **Move this ABOVE CSRF**
app.use(restoreUser);

// ✅ CSRF Protection Middleware – **AFTER restoreUser**
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: "Lax", // ✅ Keep "Lax" for CSRF to work across subdomains
      httpOnly: false, // ✅ This must be false so frontend can read it
    },
  })
);

// ✅ Middleware to Set CSRF Token in Cookies & Headers
app.use((req, res, next) => {
  try {
    const csrfToken = req.csrfToken();
    console.log("✅ Generated CSRF Token:", csrfToken);

    res.cookie("XSRF-TOKEN", csrfToken, {
      secure: isProduction,
      sameSite: "Lax",
      httpOnly: false, // ✅ Must be false so the frontend can read it
    });

    res.setHeader("XSRF-TOKEN", csrfToken);
    res.locals.csrfToken = csrfToken;
    next();
  } catch (error) {
    console.error("🚨 CSRF Middleware Error:", error);
    next(error);
  }
});

// ✅ Routes
app.use(routes);

// ✅ Error Handling Middleware
app.use((err, _req, res, _next) => {
  console.error("🚨 Error Handler:", err);
  res.status(err.status || 500).json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;