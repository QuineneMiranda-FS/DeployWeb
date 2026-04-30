// const express = require("express");
// const router = express.Router();
//short for above
const router = require("express").Router();
//controller below
const {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocationById,
  deleteLocationByID,
} = require("../controllers/LocationController");

//GET all by TimeZone Locations
router.get("/", getAllLocations);

//GET by ID
router.get("/:id", getLocationById);

//PUT by ID
router.put("/:id", updateLocationById);

//POST
router.post("/", createLocation);

//DELETE by ID
router.delete("/:id", deleteLocationByID);

module.exports = router;
