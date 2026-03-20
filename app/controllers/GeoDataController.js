const axios = require("axios");
const mongoose = require("mongoose"); // Added for validation /error handling
const GeoData = require("../models/GeoDataModel");

// GET from API [ /api/geo-data ]
const getGeoDataAPI = async (req, res) => {
  try {
    const { city, lat, lon, country } = req.query;
    let dbQuery = {};
    let apiUrl = "";
    // by lat long
    //validate
    if (lat && lon) {
      const longitude = parseFloat(lon);
      const latitude = parseFloat(lat);

      if (
        isNaN(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        isNaN(longitude) ||
        longitude < -180 ||
        longitude > 180
      ) {
        return res
          .status(400)
          .json({
            error: "Invalid coordinates. Lat: -90 to 90, Lon: -180 to 180.",
          });
      }

      dbQuery = {
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [longitude, latitude] },
            $maxDistance: 10,
          },
        },
      };

      apiUrl = `https://api.geoapify.com{lat}&lon=${lon}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;
    }
    //by city
    else if (city) {
      dbQuery = { city: new RegExp(`^${city}$`, "i") };
      if (country) dbQuery.countryCode = country.toLowerCase();

      apiUrl = `https://api.geoapify.com{encodeURIComponent(city)}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;
      if (country) apiUrl += `&filter=countrycode:${country.toLowerCase()}`;
    } else {
      return res
        .status(400)
        .json({ error: "Provide 'city' or 'lat'/'lon' parameters." });
    }

    const existingData = await GeoData.findOne(dbQuery);
    if (existingData)
      return res.json({ source: "database", data: existingData });

    const response = await axios.get(apiUrl);
    const result = response.data.results?.[0];
    if (!result) return res.status(404).json({ error: "Location not found" });

    const newGeoRecord = new GeoData({
      city: (result.city || city || "Unknown").toLowerCase(),
      countryCode: result.country_code,
      postcode: result.postcode,
      location: { type: "Point", coordinates: [result.lon, result.lat] },
      timezone: {
        timezone: {
          name: result.timezone?.name,
          name_alt: result.timezone?.name_alt,
          abbreviation_STD: result.timezone?.abbreviation_STD,
          abbreviation_DST: result.timezone?.abbreviation_DST,
          offset_STD: result.timezone?.offset_STD,
          offset_DST: result.timezone?.offset_DST,
        },
      },
    });

    const savedRecord = await newGeoRecord.save();
    res.json({ source: "api", data: savedRecord });
  } catch (err) {
    res.status(500).json({ error: "Operation failed", details: err.message });
  }
};

// POST (CREATE) & sv to db [ /api/geo-data ]
const createGeoData = async (req, res) => {
  try {
    const newEntry = new GeoData(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json({
      message: "Data saved successfully",
      id: savedEntry._id,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to save data", details: err.message });
  }
};

// GET by id [ /api/geo-data/:id ]
const getGeoDataById = async (req, res) => {
  try {
    // validate db
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const data = await GeoData.findById(req.params.id);
    if (!data) return res.status(404).json({ error: "Entry not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
};

// GET fm stored data [ /api/geo-data ]
const getStoredGeoData = async (req, res) => {
  try {
    const { city, countryCode, start, end } = req.query;
    let filter = {};

    if (city) filter.city = city.toLowerCase();
    if (countryCode) filter.countryCode = countryCode.toLowerCase();

    // validate dates
    if (start || end) {
      filter.createdAt = {};
      if (start) {
        const startDate = new Date(start);
        if (isNaN(startDate.getTime()))
          return res.status(400).json({ error: "Invalid start date" });
        filter.createdAt.$gte = startDate;
      }
      if (end) {
        const endDate = new Date(end);
        if (isNaN(endDate.getTime()))
          return res.status(400).json({ error: "Invalid end date" });
        filter.createdAt.$lte = endDate;
      }
    }

    const data = await GeoData.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

module.exports = {
  getGeoDataAPI,
  getGeoDataById,
  createGeoData,
  getStoredGeoData,
};
