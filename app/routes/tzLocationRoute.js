// const express = require("express");
// const router = express.Router();
//short for above
const router = require("express").Router();
//controller below
const {
  createTZLocation,
  getAllTZLocations,
  getTZLocationById,
  updateTZLocationById,
  deleteTZLocationByID,
} = require("../controllers/tzLocationController");

//GET all by TZ Locations
router.get("/", getAllTZLocations);

//GET by ID
router.get("/:id", getTZLocationById);

//PUT by ID
router.put("/:id", updateTZLocationById);

//POST
router.post("/", createTZLocation);

//DELETE by ID
router.delete("/:id", deleteTZLocationByID);

module.exports = router;
