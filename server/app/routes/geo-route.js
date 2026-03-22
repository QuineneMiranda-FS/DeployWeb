const router = require("express").Router();
//controller below
const {
  getGeoDataAPI,
  getGeoDataById,
  createGeoData,
  getStoredGeoData,
} = require("../controllers/GeoDataController");

//GET GeoData fm API - Accept query parameters for specifying the location (by city or by lat/long),make a fetch call to the chosen geospatial API, Parse the response and return it to the client.
router.get("/", getGeoDataAPI);

//POST - Accept geospatial data in the request body, Save the data to MongoDB,Return a success message with the saved document's ID
router.post("/", createGeoData);

// *****IMPORTANT : For Express, Static routes (like /stored) have to be before dynamic routes (like :id)
//GET stored - Retrieve all stored geospatial data from MongoDB, Implement optional query parameters for filtering (e.g., by date range or location).
router.get("/stored", getStoredGeoData); //**had route conflict...kp as stored */

//GET by ID - Retrieve a specific geospatial data entry by its MongoDB ID.
router.get("/:id", getGeoDataById);

module.exports = router;
