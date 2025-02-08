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

// ✅ Debugging Incoming Requests
app.use((req, res, next) => {
  console.log("🔍 Incoming Request:");
  console.log("➡️ Method:", req.method);
  console.log("➡️ URL:", req.url);
  console.log("➡️ Headers:", req.headers);
  console.log("➡️ Cookies:", req.cookies);
  next();
});

// ✅ CORS (Allow Frontend to Access Backend)
app.use(
  cors({
    origin: isProduction
      ? "https://luxuryvillarentals.onrender.com" // Deployed frontend origin
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

// ✅ Restore User Middleware (Ensures Authentication Works)
app.use(restoreUser);

// ✅ CSRF Protection Middleware (Must be after restoreUser)
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: "Lax",
      httpOnly: false,
    },
  })
);

app.use((req, res, next) => {
  try {
    const csrfToken = req.csrfToken();
    console.log("✅ Generated CSRF Token:", csrfToken);
    
    res.cookie("XSRF-TOKEN", csrfToken, {
      secure: isProduction,
      sameSite: "Lax",
      httpOnly: false, // Must be false to access it in the browser
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

// ✅ 404 Error Handler
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// ✅ Sequelize Validation Error Handler
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    const errors = {};
    err.errors.forEach((error) => {
      errors[error.path] = error.message;
    });
    err.title = "Validation Error";
    err.errors = errors;
  }
  next(err);
});

// ✅ Error Formatter
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