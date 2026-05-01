const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose = require("mongoose");
const { successTemplate, errorTemplate } = require("../../templates/templates");

// --- SIGNUP ROUTE ---
router.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    successTemplate(res, "User Created", { email: newUser.email });
  } catch (err) {
    errorTemplate(res, "Signup failed", 400);
  }
});

// --- LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return errorTemplate(res, "Invalid credentials", 400);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorTemplate(res, "Invalid credentials", 400);

    // Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    errorTemplate(res, err.message, 500);
  }
});

module.exports = router;
