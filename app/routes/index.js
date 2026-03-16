const express = require("express");
const router = express.Router();
//divided routes
const tzNameRoute = require("./timeZonesRoute");
const tzCityRoute = require("./tzLocationRoute");

//array storage

const timeZones = [
  { id: 1111, name: "Eastern", city: "New York" },
  { id: 2222, name: "Central", city: "Chicago" },
  { id: 3333, name: "Mountain", city: "Denver" },
  { id: 4444, name: "Pacific", city: "Los Angeles" },
];

router.get("/", (req, res) => {
  //general GET
  res.status(200).json({
    //200 is ok
    success: true,
    data: timeZones,
    message: `${req.method} - Request made to Timezones Route`,
    metadata: { hostname: req.hostname, method: req.method }, //for me
  });
});

router.use("/timeZonesRoute", timeZonesRoute);
router.use("/tzLocationRoute", tzLocationRoute);

module.exports = router;
