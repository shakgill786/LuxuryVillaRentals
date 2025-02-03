// LuxuryVillaServices/backend/routes/api/session.js

const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../../backend/db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// **Login Validation Middleware**
const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

// **Log In a User**
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  try {
    const user = await User.unscoped().findOne({
      where: { [Op.or]: [{ username: credential }, { email: credential }] },
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = setTokenCookie(res, user);

    console.log("✅ Token Set for User:", token);
    return res.json({ user });
  } catch (err) {
    next(err);
  }
});

// **Log Out a User**
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Successfully logged out" });
});

// **Restore Session User**
router.get("/", restoreUser, (req, res) => {
  return res.json({ user: req.user || null });
});

module.exports = router;