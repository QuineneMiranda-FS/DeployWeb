const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const locationRoutes = require("./locationRoutes");
const timeZoneRoutes = require("./timezonesRoutes");
const geoRoutes = require("./geoRoutes");
const protect = require("../middleware/auth");

// PUBLIC ROUTES
router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API root - Request successful",
  });
});

// PROTECTED ROUTES
router.use("/locations", protect, locationRoutes);
router.use("/timezones", protect, timeZoneRoutes);
router.use("/geoData", protect, geoRoutes);

module.exports = router;
