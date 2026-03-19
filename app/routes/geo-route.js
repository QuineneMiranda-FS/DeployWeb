const express = require("express");
const router = express.Router();
const axios = require("axios");

const GeoData = require("../models/GeoData");

router.get("/timezone/:city", async (req, res) => {
  try {
    const city = req.params.city.toLowerCase();
    const countryCode = req.query.country?.toLowerCase();

    // check db
    const data = await GeoData.findOne({
      city: city,
      // add countryCode to schema *********
    });

    if (data) return res.json({ source: "database", data });

    console.log("Fetching from external API...");

    let url = `https://api.geoapify.com{encodeURIComponent(city)}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    if (countryCode) {
      url += `&filter=countrycode:${countryCode}`;
    }

    const response = await axios.get(url);
    const results = response.data.results;

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const firstResult = results[0];

    const newGeoRecord = new GeoData({
      city: city,
      timezone: firstResult.timezone.name,
      lat: firstResult.lat,
      lng: firstResult.lon,
      lastUpdated: new Date(),
    });

    await newGeoRecord.save();
    res.json({ source: "api", data: newGeoRecord });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve geo data", details: err.message });
  }
});

module.exports = router;
