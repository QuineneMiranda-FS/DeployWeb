const express = require("express");
const router = express.Router();

const timeZoneRoutes = require("./timezones-route");
const locationRoutes = require("./location-route");
const geoRoutes = require("./geo-route");

router.get("/", (req, res) => {
  //200 = ok
  res.status(200).json({
    success: true,
    message: "API root - Request successful",
    metadata: { hostname: req.hostname, method: req.method },
  });
});

//Sub-Routers

router.use("/timezones", timeZoneRoutes);
router.use("/locations", locationRoutes);
router.use("/geoData", geoRoutes);

module.exports = router;
