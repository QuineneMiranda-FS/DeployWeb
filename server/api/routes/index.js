const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

// Anyone can sign up
router.use("/auth", authRoutes);

// Only logged-in users can see locations or timezones
router.use("/locations", protect, locationRoutes);
router.use("/timezones", protect, timeZoneRoutes);

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API root - Request successful",
    metadata: { hostname: req.hostname, method: req.method },
  });
});

// Sub-Routers
router.use("/timezones", timeZoneRoutes);
router.use("/locations", locationRoutes);
router.use("/geoData", geoRoutes);
router.use("/auth", authRoutes); // access via /api/auth/signup

module.exports = router;
