const express = require("express");
const router = express.Router();
const { saveUser, findUser } = require("../db/db");
const jwt = require("jsonwebtoken");

// POST /api/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const existingUser = await findUser({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // sv user automatic hash via bcrypt
    const savedUser = await saveUser({ email, password });

    res.status(201).json({
      message: "User created successfully!",
      userId: savedUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user
    const users = await findUser({ email });
    const user = users[0]; // Get the first user in the array

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, //short lived
    );

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});
module.exports = router;
