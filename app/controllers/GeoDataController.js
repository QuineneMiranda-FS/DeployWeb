const axios = require("axios");
const mongoose = require("mongoose"); // Added for validation /error handling
const GeoData = require("../models/GeoDataModel");

// GET from API [ /api/geo-data? ]
//specify city ie. ?city=london
//specify city with country ie. ?city=london&country=gb
//specify lat long ie. ?lat=51.5074&lon=-0.1278
const getGeoDataAPI = async (req, res) => {
  try {
    const { city, lat, lon, country, page, limit, sort, select } = req.query;

    // API if lat/lon or city provided
    if ((lat && lon) || city) {
      let dbSearchQuery = {};
      let apiUrl = "";

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
          return res.status(400).json({ error: "Invalid coordinates." });
        }

        dbSearchQuery = {
          location: {
            $near: {
              $geometry: { type: "Point", coordinates: [longitude, latitude] },
              $maxDistance: 1000,
            },
          },
        };
        apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;
      } else if (city) {
        dbSearchQuery = { city: new RegExp(`^${city}$`, "i") };
        if (country) dbSearchQuery.countryCode = country.toLowerCase();

        apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${city}&lang=en&limit=10&type=city&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;
        if (country) apiUrl += `&filter=countrycode:${country.toLowerCase()}`;
      }

      // chk db
      const existingData = await GeoData.findOne(dbSearchQuery);
      if (existingData)
        return res.json({ source: "database", data: existingData });

      // fetch
      const response = await axios.get(apiUrl);
      const result = response.data.results?.[0];

      if (!result)
        return res
          .status(404)
          .json({ error: "Location not found via Geoapify" });

      const savedRecord = await GeoData.create({
        city: (result.city || city || "Unknown").toLowerCase(),
        countryCode: result.country_code,
        postcode: result.postcode,
        location: { type: "Point", coordinates: [result.lon, result.lat] },
        timezone: {
          name: result.timezone?.name,
          name_alt: result.timezone?.name_alt,
          abbreviation_STD: result.timezone?.abbreviation_STD,
          abbreviation_DST: result.timezone?.abbreviation_DST,
          offset_STD: result.timezone?.offset_STD,
          offset_DST: result.timezone?.offset_DST,
        },
      });

      return res.json({ source: "api", data: savedRecord });
    }

    // filter
    let queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "select"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // handle partial matches
    const searchableFields = ["city", "postcode"];
    searchableFields.forEach((field) => {
      if (queryObj[field] && typeof queryObj[field] === "string") {
        queryObj[field] = { $regex: `^${queryObj[field]}`, $options: "i" };
      }
    });

    // operators
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    let dbQuery = GeoData.find(JSON.parse(queryStr));

    // select sort
    if (select) dbQuery = dbQuery.select(select.split(",").join(" "));
    dbQuery = sort
      ? dbQuery.sort(sort.split(",").join(" "))
      : dbQuery.sort("-lastUpdated");

    // paginate
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    dbQuery = dbQuery.skip((p - 1) * l).limit(l);

    const data = await dbQuery;
    res.json({ results: data.length, page: p, data });
  } catch (err) {
    res.status(500).json({ error: "Operation failed", details: err.message });
  }
};

//working code before queries added
// const getGeoDataAPI = async (req, res) => {
//   try {
//     const { city, lat, lon, country } = req.query;
//     let dbQuery = {};
//     let apiUrl = "";

//     // by lat long
//     if (lat && lon) {
//       const longitude = parseFloat(lon);
//       const latitude = parseFloat(lat);

//       if (
//         isNaN(latitude) ||
//         latitude < -90 ||
//         latitude > 90 ||
//         isNaN(longitude) ||
//         longitude < -180 ||
//         longitude > 180
//       ) {
//         return res.status(400).json({
//           error: "Invalid coordinates. Lat: -90 to 90, Lon: -180 to 180.",
//         });
//       }

//       dbQuery = {
//         location: {
//           $near: {
//             $geometry: { type: "Point", coordinates: [longitude, latitude] },
//             $maxDistance: 1000, //in km
//           },
//         },
//       };

//       apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;
//     }

//     // by city
//     else if (city) {
//       dbQuery = { city: new RegExp(`^${city}$`, "i") };
//       if (country) dbQuery.countryCode = country.toLowerCase();

//       apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${city}&lang=en&limit=10&type=city&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;

//       if (country) apiUrl += `&filter=countrycode:${country.toLowerCase()}`;
//     } else {
//       return res
//         .status(400)
//         .json({ error: "Provide 'city' or 'lat'/'lon' parameters." });
//     }

//     // chk db
//     const existingData = await GeoData.findOne(dbQuery);
//     if (existingData)
//       return res.json({ source: "database", data: existingData });

//     // fetch
//     const response = await axios.get(apiUrl);
//     console.log("Geoapify Response:", response.data); //troubleshooting
//     const result = response.data.results?.[0];

//     if (!result)
//       return res.status(404).json({ error: "Location not found via Geoapify" });

//     // sv
//     const newGeoRecord = new GeoData({
//       city: (result.city || city || "Unknown").toLowerCase(),
//       countryCode: result.country_code,
//       postcode: result.postcode,
//       location: {
//         type: "Point",
//         coordinates: [result.lon, result.lat],
//       },
//       timezone: {
//         name: result.timezone?.name,
//         name_alt: result.timezone?.name_alt,
//         abbreviation_STD: result.timezone?.abbreviation_STD,
//         abbreviation_DST: result.timezone?.abbreviation_DST,
//         offset_STD: result.timezone?.offset_STD,
//         offset_DST: result.timezone?.offset_DST,
//       },
//     });

//     const savedRecord = await newGeoRecord.save();
//     res.json({ source: "api", data: savedRecord });
//   } catch (err) {
//     console.error("API/DB Error:", err.response?.data || err.message);
//     res.status(500).json({
//       error: "Operation failed",
//       details: err.response?.data?.message || err.message,
//     });
//   }
// };

// POST (CREATE) & sv to db [ /api/geoData ] *** make sure raw json
//body should look like this: {
//   "city": "moscow",
//   "countryCode": "ru",
//   "postcode": "101000",
//   "location": {
//     "type": "Point",
//     "coordinates": [37.6173, 55.7558]
//   }
// }
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

// GET by id [ /api/geoData/ ] *you only need to type/paste id numbers
//looks like this: http://localhost:3000/api/geoData/69bcb72106932c5dcd6c1bf3
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

// GET ALL fm stored data [ /api/geoData/stored ]
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

        // has to be end of day (23:59:59)
        endDate.setUTCHours(23, 59, 59, 999);
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
